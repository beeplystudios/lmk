import { z } from "zod";
import { extractAuth } from "../middleware/auth-middleware";
import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  me: publicProcedure.use(extractAuth).query(({ ctx }) => {
    return ctx.user ?? null;
  }),

  greet: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input }) => {
      return `Hello, ${input.name}!`;
    }),
});
