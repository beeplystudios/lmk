import { Pinecone } from "@pinecone-database/pinecone";
import chalk from "chalk";
import { eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { clique, cliqueUser, lmk, post, user } from "./db/schema";
import { IngestiblePost } from "./rss/ingest";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
if (!PINECONE_API_KEY) throw "process.env.PINECONE_API_KEY is not set";

export const pc = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

export const INDEX_NAME = process.env.PINECONE_INDEX_NAME;
if (!INDEX_NAME) throw "process.env.PINECONE_INDEX_NAME is not set";

const index = await pc
  .listIndexes()
  .then((r) => r.indexes?.find((idx) => idx.name === INDEX_NAME));

if (!index) {
  console.log(`[pinecone] index "${INDEX_NAME}" not found. creating it...`);
  await pc.createIndexForModel({
    name: INDEX_NAME,
    cloud: "aws",
    region: "us-east-1",
    embed: {
      model: "llama-text-embed-v2",
      fieldMap: { text: "embed" },
    },
    waitUntilReady: true,
  });
  console.log(
    `[pinecone] index "${INDEX_NAME}" created because it does not exist`
  );
} else {
  const stat = await pc.index(index.name).describeIndexStats();
  console.log(
    `[pinecone] index "${INDEX_NAME}" found. #records=${stat.totalRecordCount}`
  );
}

export interface NotificationItem {
  to: string;
  email: string;
  data: string;
  body: string;
  title: string;
  link: string;
  source: string;
}

/**
 * Checks the new post against Pinecone index and updates users on their LMKs if
 * the new post is relevant to them.
 */
export const checkNewPost = async (
  newPost: IngestiblePost
): Promise<NotificationItem[]> => {
  const databasePost = await db
    .select({
      description: post.description,
      title: post.title,
      link: post.link,
      source: post.source,
    })
    .from(post)
    .where(eq(lmk.id, newPost._id))
    .limit(1)
    .then((res) => res[0]);

  let allLmkIds: string[] = [];

  while (true) {
    const response = await pc
      .index(INDEX_NAME)
      .namespace("lmks")
      .searchRecords({
        query: {
          topK: 10,
          inputs: { text: newPost.embed },
        },
      });

    const resultsOverConfidence = response.result.hits.filter(
      (hit) => hit._score && hit._score >= 0.3
    );

    allLmkIds = allLmkIds.concat(resultsOverConfidence.map((hit) => hit._id));

    await pc
      .index(INDEX_NAME)
      .namespace("lmks")
      .deleteMany(resultsOverConfidence.map((hit) => hit._id));

    if (resultsOverConfidence.length === 10) {
      console.log(
        `notifications: post "${newPost.title}" matched 10/10 results over confidence threshold, removing records from query and running query again..`
      );
    } else {
      break;
    }
  }

  const allLmks = await db
    .select({ token: user.token, email: user.email })
    .from(lmk)
    .innerJoin(user, eq(user.id, cliqueUser.userId))
    .innerJoin(cliqueUser, eq(lmk.cliqueId, cliqueUser.cliqueId))
    .innerJoin(clique, eq(clique.id, lmk.cliqueId))
    .where(inArray(lmk.id, allLmkIds));

  const notificationsBatch: NotificationItem[] = [];

  for (const lmk of allLmks) {
    notificationsBatch.push({
      to: lmk.token,
      email: lmk.email,
      data: JSON.stringify({
        type: "NEW_RELEVANT_POST",
        postId: newPost._id,
      }),
      body: databasePost.description,
      title: `Letting You Know: ${databasePost.title}`,
      link: databasePost.link,
      source: databasePost.source,
    });
  }

  console.log(
    chalk.blue(
      `notifications: sending notifications batch. count=${notificationsBatch.length}`
    )
  );
  for (const notification of notificationsBatch.splice(0, 10)) {
    console.log(
      chalk.dim(
        `notifications: --> token=${notification.to}, title="${notification.title}"`
      )
    );
  }
  if (notificationsBatch.length > 10) {
    console.log(
      chalk.dim(
        `notifications: --> and ${notificationsBatch.length - 10} more...`
      )
    );
  }

  return notificationsBatch;
};
