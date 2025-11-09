// Raw RSS feeds
// ---(cleanup + object mixing)-> RawNewsPost
// ---(LLM + object mixing)--> IngestibleNewsPost --> Pinecone!

import chalk from "chalk";
import { inArray } from "drizzle-orm";
import { cluster } from "radash";
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
  reportNewPost: (post: IngestiblePost) => Promise<void>;
}

export const ingestTransformer = async (
  ctx: IngestCtx,
  feed: FeedWithTransformer
) => {
  const start = new Date();

  console.log(
    chalk.blue(`ingest: starting ingestion! start=${start.toISOString()}`)
  );

  const results = await feed.transformer(feed.url);

  const BATCH_SIZE = 50;
  const batches: { post: IngestiblePost; isNew: boolean }[][] = [];

  const insertBatched = (upsertedPost: IngestiblePost, isNew: boolean) => {
    if (
      batches.length === 0 ||
      batches[batches.length - 1].length >= BATCH_SIZE
    )
      batches.push([]);
    batches[batches.length - 1].push({ post: upsertedPost, isNew });
  };

  const existsList = new Map<
    string,
    {
      id: string;
      betterHeadline: string;
      description: string | null;
      title: string;
      source: string;
    }
  >();

  const promises = cluster(results, 50).map(async (batch) => {
    const links = batch.map((post) => post.link);
    const existingPosts = await db
      .select()
      .from(post)
      .where(inArray(post.link, links));

    return existingPosts.map((p) => ({ link: p.link, p }));
  });
  const groups = await Promise.all(promises);
  for (const group of groups)
    for (const record of group) existsList.set(record.link, record.p);

  for (const rawPost of results) {
    const existingPost = existsList.get(rawPost.link);
    if (existingPost) {
      console.log(chalk.dim("ingest: skipping existing post", rawPost.title));

      insertBatched(
        {
          _id: existingPost.id,
          embed: existingPost.betterHeadline,
          description: existingPost.description,
          title: existingPost.title,
          source: existingPost.source,
        },
        false
      );

      continue;
    }

    const ingestStart = Date.now();

    console.log(
      chalk.dim(`ingest: creating better headline for '${rawPost.title}'`)
    );
    const betterPost = await expandRawNewsPost(rawPost);
    console.log(
      chalk.dim(`ingest: --> better headline: ${betterPost.headline}`)
    );

    // Insert into the main database
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
      chalk.green(
        "ingest: --> processed post",
        rawPost.title,
        "in",
        `${Date.now() - ingestStart}ms`
      )
    );

    insertBatched(upsertedPost, true);
  }

  console.log(
    chalk.green(
      `ingest: !!! done inserting into main database! created ${batches.length} batches for Pinecone...`
    )
  );

  for (const [i, batch] of batches.entries()) {
    console.log(
      chalk.green(`ingest: --> upserting batch ${i + 1}/${batches.length}...`)
    );
    await pc
      .index(INDEX_NAME)
      .namespace("posts")
      .upsertRecords([
        ...batch.map((record) => ({
          ...record.post,
        })),
      ]);
  }

  const end = new Date();

  const createdRecords = batches.reduce((acc, batch) => acc + batch.length, 0);
  const totalRecords = db.$count(post);

  console.log(
    chalk.blue(
      `ingest: !!! finished ingestion for '${
        feed.slug
      }'! end=${end.toISOString()}`
    )
  );
  console.log(
    chalk.dim(`ingest: --> duration=${end.getTime() - start.getTime()}ms`)
  );
  console.log(
    chalk.dim(
      `ingest: --> created records=${createdRecords} total records=${await totalRecords}`
    )
  );
};
