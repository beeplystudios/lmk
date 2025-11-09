import { desc, eq } from "drizzle-orm";
import z from "zod";
import { clique, cliqueUser, lmk } from "../db/schema";
import { authedProcedure } from "../middleware/auth-middleware";
import { cliqueProcedure } from "../middleware/clique";
import { router } from "../trpc";

export const cliqueRouter = router({
  create: authedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(clique)
        .values({
          creatorId: ctx.user.id,
          name: input.name,
        })
        .returning()
        .then((res) => res[0]);

      await ctx.db.insert(cliqueUser).values({
        cliqueId: result.id,
        userId: ctx.user.id,
      });

      return result;
    }),

  list: authedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({ clique })
      .from(cliqueUser)
      .innerJoin(clique, eq(clique.id, cliqueUser.cliqueId))
      .where(eq(cliqueUser.userId, ctx.user.id));
  }),

  getLmks: cliqueProcedure.query(async ({ ctx, input }) => {
    return await ctx.db
      .select()
      .from(lmk)
      .where(eq(lmk.cliqueId, input.cliqueId))
      .orderBy(desc(lmk.createdAt));
  }),
});
