import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Hono!"));

const server = Bun.serve({
  fetch: app.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
});

console.log(`lmk server running at ${server.url}`);
