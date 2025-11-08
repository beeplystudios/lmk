import { eq } from "drizzle-orm";
import z from "zod";
import { clique, lmk } from "../db/schema";
import { authedProcedure } from "../middleware/auth-middleware";
import { router } from "../trpc";

export const lmkRouter = router({
  create: authedProcedure
    .input(
      z.object({
        query: z.string().min(1),
        // if the lmk is private to someone, leave this out
        cliqueId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cliqueId = input.cliqueId
        ? input.cliqueId
        : // if no cliqueId provided, use the user's "Private" clique
          await ctx.db
            .select()
            .from(clique)
            .where(eq(clique.creatorId, ctx.user.id))
            .then((res) => res[0].id);

      const result = await ctx.db
        .insert(lmk)
        .values({
          cliqueId,
          query: input.query,
        })
        .returning()
        .then((res) => res[0]);

      return result;
    }),
});
