import { FEEDS } from "@/src/rss/feeds";
import { ingestTransformer } from "@/src/rss/ingest";
import chalk from "chalk";

const slug = Bun.argv[2];
console.log(chalk.blue("import-index: starting ingestion for feed", slug));

if (slug === "all") {
  for (const feed of FEEDS) {
    try {
      await ingestTransformer(
        {
          reportNewPost: async (post) => {
            console.log(
              chalk.green(
                `import-index: new post from feed=${feed.slug} title='${post.title}'`
              )
            );
          },
        },
        feed
      );
    } catch (err) {
      console.error(
        `import-index: error ingesting feed=${feed.slug}. skipping...`,
        err
      );
    }
  }
} else {
  const feed = FEEDS.find((f) => f.slug === slug);
  if (!feed) {
    console.error(`import-index: no feed found with slug=${slug}`);
    process.exit(1);
  }

  await ingestTransformer(
    {
      reportNewPost: async (post) => {
        console.log(
          chalk.green(
            `import-index: new post from feed=${feed.slug} title='${post.title}'`
          )
        );
      },
    },
    feed
  );

  console.log("import-index: finished ingestion for feed", slug);
}

process.exit(0);
