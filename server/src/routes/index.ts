import { z } from "zod";
import { extractAuth } from "../middleware/auth-middleware";
import { publicProcedure, router } from "../trpc";
import { lmkRouter } from "./lmk";

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
