import { batchNotifyPost } from "@/src/batch";
import chalk from "chalk";
import { checkNewPost, INDEX_NAME, pc } from "../src/pinecone";
import { POSTS } from "./post";

console.log(
  chalk.blue(
    "notify-example: this script simulates notifying users about a new post"
  )
);

const post = POSTS[Bun.argv[2]] as (typeof POSTS)[keyof typeof POSTS];
if (!post) {
  console.error(`notify-example: no post found with key=${Bun.argv[2]}`);
  process.exit(1);
}

console.log(chalk.green("notify-example: ingesting post", post.title));
// insert into pinecone
await pc
  .index(INDEX_NAME)
  .namespace("posts")
  .upsertRecords([{ _id: "faux", embed: post.betterHeadline }]);

const notifications = await checkNewPost(
  {
    _id: "faux",
    embed: post.betterHeadline,
    ...post,
  },
  post
);

await pc.index(INDEX_NAME).namespace("posts").deleteMany(["faux"]);

console.log(
  chalk.green(
    `notify-example: found ${notifications.length} notifications for post`,
    post.title
  )
);

await batchNotifyPost(notifications);

process.exit(0);
