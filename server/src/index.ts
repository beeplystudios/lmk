import { trpcServer } from "@hono/trpc-server";
import chalk from "chalk";
import { Hono } from "hono";
import { auth } from "./auth";
import { db } from "./db";
import "./pinecone";
import { checkNewPost, NotificationItem } from "./pinecone";
import { createMatchEmail, sendEmail } from "./resend";
import { appRouter } from "./routes";
import { ingestAllFeeds } from "./rss/ingest";

const app = new Hono();

app.get("/", (c) => c.text("Hono!"));
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

let CHECK_INTERVAL = 60 * 60; // 1 hour
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

          console.log(
            chalk.green(
              `notification: sending batch of ${batchToSend.length} notifications...`
            )
          );

          // send emails
          for (const notification of batchToSend) {
            console.log(
              chalk.dim(
                `notification: --> sending email notification to ${notification.to}...`
              )
            );

            await sendEmail(
              notification.email,
              createMatchEmail(
                notification.title,
                notification.link,
                notification.source
              )
            );
          }
        }
      },
    });
  }, CHECK_INTERVAL);

export type AppRouter = typeof appRouter;
