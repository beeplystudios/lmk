import { POSTS } from "./post";

const post = POSTS[Bun.argv[2]];
if (!post) {
  console.error(`ingest-bullshit: no post found with key=${Bun.argv[2]}`);
  process.exit(1);
}

console.log("ingest-bullshit: ingesting post", post.title);
