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
      const result = await ctx.db.transaction(async (tx) => {
        const newLmk = await tx
          .insert(lmk)
          .values({
            cliqueId: ctx.cliqueId,
            query: input.query,
          })
          .returning()
          .then((res) => res[0]);

        await pc
          .index(INDEX_NAME)
          .namespace("lmks")
          .upsertRecords([{ _id: newLmk.id, embed: newLmk.query }]);
      });

      return result;
    }),

  list: cliqueProcedure.query(async ({ ctx, input }) => {
    const lmks = await ctx.db
      .select()
      .from(lmk)
      .where(eq(lmk.cliqueId, ctx.cliqueId))
      .orderBy(desc(lmk.createdAt));

    const lmksWithQueryResults = await Promise.all(
      lmks.map(async (lmkItem) => {
        return {
          ...lmkItem,
          answer: await pc
            .index(INDEX_NAME)
            .namespace("posts")
            .searchRecords({
              query: {
                inputs: { text: lmkItem.query },
                topK: 1,
              },
            })
            .then((res) =>
              z
                .object({
                  fields: z.object({
                    title: z.string(),
                    description: z.string(),
                    source: z.string(),
                  }),
                })
                .optional()
                .parse(res.result.hits.filter((hit) => hit._score > 0.3).at(0))
            ),
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
