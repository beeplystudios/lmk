import { publicProcedure, router } from "@/trpc";
import { z } from "zod";

export const appRouter = router({
  greet: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input }) => {
      return `Hello, ${input.name}!`;
    }),
});
