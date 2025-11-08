import { initTRPC } from "@trpc/server";
import { Context as HonoContext } from "hono";
import { db } from "./db";

export const createTRPCContext = (ctx: HonoContext) => {
  return {
    honoCtx: ctx,
    db,
  };
};

const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createTRPCMiddleware = t.middleware;
