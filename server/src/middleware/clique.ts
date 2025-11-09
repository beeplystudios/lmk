import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { clique, cliqueUser } from "../db/schema";
import { authedProcedure } from "./auth-middleware";

export const cliqueProcedure = authedProcedure
  .input(z.object({ cliqueId: z.cuid2().optional() }))
  .use(async ({ ctx, input, next }) => {
    const cliqueId = input.cliqueId
      ? input.cliqueId
      : // if no cliqueId provided, use the user's "Private" clique
        await ctx.db
          .select()
          .from(clique)
          .where(eq(clique.creatorId, ctx.user.id))
          .then((res) => res[0].id);

    // Ensure the user is a member of the clique
    const isMember = await ctx.db
      .select()
      .from(clique)
      .innerJoin(cliqueUser, eq(clique.id, cliqueUser.cliqueId))
      .where(and(eq(clique.id, cliqueId), eq(cliqueUser.userId, ctx.user.id)))
      .then((res) => res.length > 0);

    if (!isMember) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a member of this clique.",
      });
    }

    return next({
      ctx: {
        ...ctx,
        cliqueId,
      },
    });
  });
