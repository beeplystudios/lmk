import { desc, eq } from "drizzle-orm";
import z from "zod";
import { lmk } from "../db/schema";
import { cliqueProcedure } from "../middleware/clique";
import { router } from "../trpc";

export const lmkRouter = router({
  create: cliqueProcedure
    .input(z.object({ query: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(lmk)
        .values({
          cliqueId: ctx.cliqueId,
          query: input.query,
        })
        .returning()
        .then((res) => res[0]);

      return result;
    }),

  list: cliqueProcedure.query(async ({ ctx, input }) => {
    return await ctx.db
      .select()
      .from(lmk)
      .where(eq(lmk.cliqueId, ctx.cliqueId))
      .orderBy(desc(lmk.createdAt));
  }),
});
