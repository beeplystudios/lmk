import { TRPCError } from "@trpc/server";
import { auth } from "../auth";
import { createTRPCMiddleware, publicProcedure } from "../trpc";

export const extractAuth = createTRPCMiddleware(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: ctx.honoCtx.req.raw.headers,
  });

  return next({
    ctx: {
      user: session?.user,
    },
  });
});

export const authedProcedure = publicProcedure
  .use(extractAuth)
  .use(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
