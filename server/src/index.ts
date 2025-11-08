import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { auth } from "./auth";
import "./pinecone";
import { appRouter } from "./routes";

const app = new Hono();

app.get("/", (c) => c.text("Hono!"));
app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

const server = Bun.serve({
  fetch: app.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
});

console.log(`lmk server running at ${server.url}`);

export type AppRouter = typeof appRouter;
