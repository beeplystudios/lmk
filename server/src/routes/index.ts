import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  greet: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input }) => {
      return `Hello, ${input.name}!`;
    }),
});
