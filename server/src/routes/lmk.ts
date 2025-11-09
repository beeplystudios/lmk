import { and, desc, eq, inArray } from "drizzle-orm";
import z from "zod";
import { lmk, post } from "../db/schema";
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
            .then(async (res) => {
              const data = await z
                .object({
                  fields: z.object({
                    title: z.string(),
                    description: z.string(),
                    source: z.string(),
                  }),
                })
                .optional()
                .parse(res.result.hits.filter((hit) => hit._score > 0.3).at(0));

              const fullPost = data
                ? (
                    await ctx.db
                      .select()
                      .from(post)
                      .where(
                        eq(
                          post.id,
                          res.result.hits
                            .filter((hit) => hit._score > 0.3)
                            .at(0)!._id
                        )
                      )
                  )[0]
                : undefined;

              return fullPost;
            }),
        };
      })
    );

    return lmksWithQueryResults;
  }),

  explore: cliqueProcedure.query(async ({ ctx }) => {
    const lmks = await ctx.db
      .select()
      .from(lmk)
      .where(eq(lmk.cliqueId, ctx.cliqueId))
      .orderBy(desc(lmk.createdAt));

    const lmksWithQueryResults = await Promise.all(
      lmks.map(async (lmkItem) => {
        return {
          ...lmkItem,
          hits: await pc
            .index(INDEX_NAME)
            .namespace("posts")
            .searchRecords({
              query: {
                inputs: { text: lmkItem.query },
                topK: 10_000,
              },
            })
            .then((res) =>
              z
                .array(
                  z.object({
                    _id: z.string(),
                    _score: z.number(),
                    fields: z.object({
                      title: z.string(),
                      description: z.string(),
                      source: z.string(),
                    }),
                  })
                )
                .optional()
                .default([])
                .parse(res.result.hits.filter((hit) => hit._score > 0.2))
                .slice(1)
            ),
        };
      })
    );

    const flattened = lmksWithQueryResults
      .filter((lmk) => lmk.hits.length > 0)
      .flatMap((lmk) => lmk.hits);

    const posts = await ctx.db
      .select()
      .from(post)
      .where(
        inArray(
          post.id,
          flattened.map((lmk) => lmk._id)
        )
      );

    return posts;
  }),

  delete: cliqueProcedure
    .input(z.object({ lmkId: z.cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(lmk)
        .where(and(eq(lmk.id, input.lmkId), eq(lmk.cliqueId, ctx.cliqueId)));
    }),
});
