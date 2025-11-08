// Raw RSS feeds
// ---(cleanup + object mixing)-> RawNewsPost
// ---(LLM + object mixing)--> IngestibleNewsPost --> Pinecone!

import { Index } from "@pinecone-database/pinecone";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { post } from "../db/schema";
import { INDEX_NAME, pc } from "../pinecone";
import { expandRawNewsPost } from "./expand";
import { FeedWithTransformer } from "./feeds";

/**
 * A news post directly extracted from an RSS feed.
 */
export interface RawPost {
  title: string;
  /** Where the post came from. e.g. "NYTimes", "Reuters", "Associated Press" */
  source: string;
  /** If given by the author of the post, a blurb of what the source is about */
  description: string | null;

  link: string;
  image: string | null;
  datePublished: Date | null;
}

/**
 * The content of a NewsPost that is actually stored in the vector database.
 */
export interface IngestiblePost {
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
  const batches: IngestiblePost[][] = [];

  const insertBatched = (upsertedPost: IngestiblePost) => {
    if (
      batches.length === 0 ||
      batches[batches.length - 1].length >= BATCH_SIZE
    )
      batches.push([]);
    batches[batches.length - 1].push(upsertedPost);
  };

  for (const rawPost of results) {
    const newPost = await db
      .select()
      .from(post)
      .where(eq(post.link, rawPost.link))
      .limit(1)
      .then((res) => res[0]);

    if (newPost) {
      console.log("ingest: skipping existing post", rawPost.title);

      insertBatched({
        _id: newPost.id,
        embed: newPost.betterHeadline,
        description: newPost.description,
        title: newPost.title,
        source: newPost.source,
      });

      continue;
    }

    const ingestStart = Date.now();
    console.log("ingest: processing post", rawPost.title);
    const betterPost = await expandRawNewsPost(rawPost);
    console.log("ingest: --> better headline:", betterPost.headline);

    // Upsert into posts
    const existing = await db
      .insert(post)
      .values({
        source: rawPost.source,
        title: rawPost.title,
        betterHeadline: betterPost.headline,
        description: rawPost.description,
        link: rawPost.link,
        image: rawPost.image,
        datePublished: rawPost.datePublished,
      })
      .returning({ id: post.id })
      .then((res) => res[0]);

    // Batch updates before sending to Pinecone
    const upsertedPost = {
      _id: existing.id,
      embed: betterPost.headline,
      description: rawPost.description,
      title: rawPost.title,
      source: rawPost.source,
    } satisfies IngestiblePost;

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
    await pc
      .index(INDEX_NAME)
      .namespace("posts")
      .upsertRecords([
        ...batch.map((post) => ({
          ...post,
        })),
      ]);
  }

  const end = new Date();
  console.log(`ingest: finished ingestion! end=${end.toISOString()}`);
  console.log(`ingest: duration=${end.getTime() - start.getTime()}ms`);
};
