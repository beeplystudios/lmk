import { FEEDS } from "@/src/rss/feeds";
import { ingestTransformer } from "@/src/rss/ingest";

const slug = Bun.argv[2];
console.log("import-index: starting ingestion for feed", slug);

const feed = FEEDS.find((f) => f.slug === slug);
if (!feed) {
  console.error(`import-index: no feed found with slug=${slug}`);
  process.exit(1);
}

await ingestTransformer(feed);

console.log("import-index: finished ingestion for feed", slug);

process.exit(0);
