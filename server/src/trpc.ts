import { initTRPC } from "@trpc/server";
import { Context as HonoContext } from "hono";

export const createTRPCContext = (ctx: HonoContext) => {
  return {
    honoCtx: ctx,
  };
};

const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createTRPCMiddleware = t.middleware;
