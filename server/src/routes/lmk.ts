import { and, desc, eq } from "drizzle-orm";
import z from "zod";
import { lmk } from "../db/schema";
import { cliqueProcedure } from "../middleware/clique";
import { INDEX_NAME, pc } from "../pinecone";
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
    const lmks = await ctx.db
      .select()
      .from(lmk)
      .where(eq(lmk.cliqueId, ctx.cliqueId))
      .limit(5)
      .orderBy(desc(lmk.createdAt));

    const lmksWithQueryResults = await Promise.all(
      lmks.map(async (lmkItem) => {
        return {
          ...lmkItem,
          answers: await pc
            .index(INDEX_NAME)
            .namespace("posts")
            .searchRecords({
              query: {
                inputs: { text: lmkItem.query },
                topK: 3,
              },
            })
            .then((res) => res.result.hits.filter((hit) => hit._score > 0.3)),
        };
      })
    );

    return lmksWithQueryResults;
  }),

  delete: cliqueProcedure
    .input(z.object({ lmkId: z.cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(lmk)
        .where(and(eq(lmk.id, input.lmkId), eq(lmk.cliqueId, ctx.cliqueId)));
    }),
});
