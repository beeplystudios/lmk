import { eq } from "drizzle-orm";
import z from "zod";
import { clique } from "../db/schema";
import { authedProcedure } from "./auth-middleware";

export const cliqueProcedure = authedProcedure
  .input(z.object({ cliqueId: z.cuid().optional() }))
  .use(async ({ ctx, input, next }) => {
    const cliqueId = input.cliqueId
      ? input.cliqueId
      : // if no cliqueId provided, use the user's "Private" clique
        await ctx.db
          .select()
          .from(clique)
          .where(eq(clique.creatorId, ctx.user.id))
          .then((res) => res[0].id);

    return next({
      ctx: {
        ...ctx,
        cliqueId,
      },
    });
  });
