import { batchNotifyPost } from "@/src/batch";
import { db } from "@/src/db";
import { post } from "@/src/db/schema";
import chalk from "chalk";
import { checkNewPost, INDEX_NAME, pc } from "../src/pinecone";
import { POSTS } from "./post";

console.log(
  chalk.blue(
    "notify-example: this script simulates notifying users about a new post"
  )
);

const newPost = POSTS[Bun.argv[2]] as (typeof POSTS)[keyof typeof POSTS];
if (!newPost) {
  console.error(`notify-example: no post found with key=${Bun.argv[2]}`);
  process.exit(1);
}

console.log(chalk.green("notify-example: ingesting post", newPost.title));
// insert into db and pinecone
await db.transaction(async (tx) => {
  const dbPost = await tx
    .insert(post)
    .values({
      source: newPost.source,
      title: newPost.title,
      link: newPost.link,
      description: newPost.description,
      image: newPost.image,
      datePublished: newPost.datePublished,
      betterHeadline: newPost.betterHeadline,
    })
    .returning({ id: post.id })
    .then((r) => r[0].id);

  await pc
    .index(INDEX_NAME)
    .namespace("posts")
    .upsertRecords([{ _id: dbPost, embed: newPost.betterHeadline }]);

  console.log(
    chalk.green("notify-example: inserted post into db and pinecone", dbPost)
  );
});

const notifications = await checkNewPost(
  {
    _id: "faux",
    embed: newPost.betterHeadline,
    ...newPost,
  },
  newPost
);

// await pc.index(INDEX_NAME).namespace("posts").deleteMany(["faux"]);

console.log(
  chalk.green(
    `notify-example: found ${notifications.length} notifications for post`,
    newPost.title
  )
);

await batchNotifyPost(notifications);

process.exit(0);
