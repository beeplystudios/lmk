// Raw RSS feeds
// ---(cleanup + object mixing)-> RawNewsPost
// ---(LLM + object mixing)--> IngestibleNewsPost --> Pinecone!

import { Index } from "@pinecone-database/pinecone";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { newsPostsTable } from "../db/schema";
import { INDEX_NAME, pc } from "../pinecone";
import { expandRawNewsPost } from "./expand";
import { FeedWithTransformer } from "./feeds";

/**
 * A news post directly extracted from an RSS feed.
 */
export interface RawNewsPost {
  title: string;
  /** Where the post came from. e.g. "NYTimes", "Reuters", "Associated Press" */
  source: string;
  /** If given by the author of the post, a blurb of what the source is about */
  description: string | null;

  link: string;
  image: string | null;
}

/**
 * The content of a NewsPost that is actually stored in the vector database.
 */
export interface IngestibleNewsPost {
  title: string;
  description: string;

  /**
   * An ID referring to the NewsPost record in the database, used for additional
   * transformations on a queried IngestibleNewsPost.
   * */
  _id: string;
  /**
   * Pinecone allows metadata to be filtered through. If someone wanted to
   * filter based off of news-outlet, they can do so with this field.
   */
  source: string;
  /**
   * Derived from passing the data through an LLM, enriches a NewsPost with
   * more contextual information not necessarily described in the
   * title/description.
   */
  embed: string;
}

export interface IngestCtx {
  index: Index;
  namespace: string;
}

export const ingestTransformer = async (feed: FeedWithTransformer) => {
  const start = new Date();

  console.log(`ingest: starting ingestion! start=${start.toISOString()}`);

  const results = await feed.transformer(feed.url);

  const BATCH_SIZE = 50;
  const batches: IngestibleNewsPost[][] = [];

  const insertBatched = (upsertedPost: IngestibleNewsPost) => {
    if (
      batches.length === 0 ||
      batches[batches.length - 1].length >= BATCH_SIZE
    )
      batches.push([]);
    batches[batches.length - 1].push(upsertedPost);
  };

  for (const rawPost of results) {
    const post = await db
      .select()
      .from(newsPostsTable)
      .where(eq(newsPostsTable.link, rawPost.link))
      .limit(1)
      .then((res) => res[0]);

    if (post) {
      console.log("ingest: skipping existing post", rawPost.title);

      insertBatched({
        _id: post.id,
        embed: post.betterHeadline,
        description: post.description,
        title: post.title,
        source: post.source,
      });

      continue;
    }

    const ingestStart = Date.now();
    console.log("ingest: processing post", rawPost.title);
    const betterPost = await expandRawNewsPost(rawPost);
    console.log(betterPost);

    // Upsert into newsPostsTable
    const existing = await db
      .insert(newsPostsTable)
      .values({
        source: rawPost.source,
        title: rawPost.title,
        betterHeadline: betterPost.headline,
        description: rawPost.description,
        link: rawPost.link,
        image: rawPost.image,
      })
      .onConflictDoUpdate({
        target: newsPostsTable.link,
        set: {
          source: rawPost.source,
          title: rawPost.title,
          description: rawPost.description,
          image: rawPost.image,
        },
      })
      .returning({ id: newsPostsTable.id })
      .then((res) => res[0]);

    // Batch updates before sending to Pinecone
    const upsertedPost = {
      _id: existing.id,
      embed: betterPost.headline,
      description: rawPost.description,
      title: rawPost.title,
      source: rawPost.source,
    } satisfies IngestibleNewsPost;

    console.log(
      "ingest: processed post",
      rawPost.title,
      "in",
      `${Date.now() - ingestStart}ms`
    );

    insertBatched(upsertedPost);
  }

  console.log(`ingest: created ${batches.length} batches for Pinecone`);

  for (const [i, batch] of batches.entries()) {
    console.log(`ingest: upserting batch ${i + 1}/${batches.length}...`);
    await pc.index(INDEX_NAME).upsertRecords([
      ...batch.map((post) => ({
        ...post,
      })),
    ]);
  }

  const end = new Date();
  console.log(`ingest: finished ingestion! end=${end.toISOString()}`);
  console.log(`ingest: duration=${end.getTime() - start.getTime()}ms`);
};
