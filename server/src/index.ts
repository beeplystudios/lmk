import { trpcServer } from "@hono/trpc-server";
import { inferRouterOutputs } from "@trpc/server";
import chalk from "chalk";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { auth } from "./auth";
import { batchNotifyPost } from "./batch";
import { db } from "./db";
import "./pinecone";
import { checkNewPost, NotificationItem } from "./pinecone";
import { appRouter } from "./routes";
import { ingestAllFeeds } from "./rss/ingest";

const app = new Hono();

app.use("*", serveStatic({ root: "./static" }));
app.use("/api/trpc/*", (context, next) =>
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: () => {
      return {
        honoCtx: context,
        db,
      };
    },
  })(context, next)
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

const server = Bun.serve({
  fetch: app.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  hostname: "0.0.0.0",
});

console.log(chalk.green(`lmk server running at ${server.url}`));

const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour
if (process.env.DO_INGEST)
  setInterval(() => {
    let currentBatch: NotificationItem[] = [];

    ingestAllFeeds({
      reportNewPost: async (post) => {
        console.log(
          chalk.green(
            "notification: new post ingested! checking against database and maybe notifying users...\n",
            post.title
          )
        );

        const notifications = await checkNewPost(post);
        currentBatch = currentBatch.concat(notifications);

        if (currentBatch.length >= 50) {
          const batchToSend = currentBatch;
          currentBatch = [];
          await batchNotifyPost(batchToSend);
        }
      },
    });
  }, CHECK_INTERVAL);

export type AppRouter = typeof appRouter;
export type TRPCRouterOutputs = inferRouterOutputs<AppRouter>;
