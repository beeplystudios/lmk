// Raw RSS feeds
// ---(cleanup + object mixing)-> RawNewsPost
// ---(LLM + object mixing)--> IngestibleNewsPost --> Pinecone!

import { Index } from "@pinecone-database/pinecone";
import { db } from "../db";
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

  image: string | null;
  link: string | null;
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
  id: string;
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
  betterHeadline: string;
}

export interface IngestCtx {
  index: Index;
  namespace: string;
}

export const ingestTransformer = async (feed: FeedWithTransformer) => {
  const start = new Date();

  console.log(`ingest: starting ingestion! start=${start.toISOString()}`);

  await db.transaction(async (tx) => {
    const results = await feed.transformer(feed.url);
    console.log(results);
  });

  const end = new Date();
  console.log(`ingest: finished ingestion! end=${end.toISOString()}`);
  console.log(`ingest: duration=${end.getTime() - start.getTime()}ms`);
};
