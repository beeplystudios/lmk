import { EXAMPLE_RAW_NEWS_POST, expandRawNewsPost } from "./expand";

const start = Date.now();
const expandedNewsPost = await expandRawNewsPost(EXAMPLE_RAW_NEWS_POST[0]);

console.log(`elapsed time: ${Date.now() - start}ms`);
console.log(expandedNewsPost);
