import { TRPCError } from "@trpc/server";
import { count, desc, eq } from "drizzle-orm";
import z from "zod";
import { clique, cliqueUser, lmk, user } from "../db/schema";
import { authedProcedure } from "../middleware/auth-middleware";
import { cliqueProcedure } from "../middleware/clique";
import { router } from "../trpc";

export const cliqueRouter = router({
  create: authedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      console.log("CREATING...");
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
    const cliques = await ctx.db
      .select({
        clique,
        userCount: count(cliqueUser.userId),
      })
      .from(cliqueUser)
      .innerJoin(clique, eq(clique.id, cliqueUser.cliqueId))
      .where(eq(cliqueUser.userId, ctx.user.id))
      .groupBy(clique.id);

    const cliquesWithLmkCount = await Promise.all(
      cliques.map(async (clique) => {
        const lmks = await ctx.db
          .select()
          .from(lmk)
          .where(eq(lmk.cliqueId, clique.clique.id));

        return {
          ...clique,
          lmks: lmks,
        };
      })
    );

    console.log(cliquesWithLmkCount);

    return cliquesWithLmkCount;
  }),

  getUsers: cliqueProcedure.query(async ({ ctx, input }) => {
    const cliquesWithUsers = await ctx.db
      .select({
        user,
      })
      .from(cliqueUser)
      .innerJoin(user, eq(user.id, cliqueUser.userId))
      .where(eq(cliqueUser.cliqueId, input.cliqueId));

    return cliquesWithUsers.map((c) => c.user);
  }),

  invite: cliqueProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [query] = await ctx.db
        .select()
        .from(user)
        .where(eq(user.email, input.email));

      if (!query)
        throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });

      await ctx.db.insert(cliqueUser).values({
        cliqueId: ctx.cliqueId,
        userId: query.id,
      });
    }),

  getLmks: cliqueProcedure.query(async ({ ctx, input }) => {
    return await ctx.db
      .select()
      .from(lmk)
      .where(eq(lmk.cliqueId, input.cliqueId))
      .orderBy(desc(lmk.createdAt));
  }),
});
