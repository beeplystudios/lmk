import { z } from "zod";
import { authedProcedure, extractAuth } from "../middleware/auth-middleware";
import { publicProcedure, router } from "../trpc";

const lmkRouter = router({
  create: authedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Implementation for creating a new "lmk" item
      return { id: "new-id", content: input.content, userId: ctx.user.id };
    }),
});

export const appRouter = router({
  lmk: lmkRouter,

  me: publicProcedure.use(extractAuth).query(({ ctx }) => {
    return ctx.user ?? null;
  }),

  greet: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input }) => {
      return `Hello, ${input.name}!`;
    }),
});
