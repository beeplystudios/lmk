import z from "zod";
import { authedProcedure } from "../middleware/auth-middleware";
import { router } from "../trpc";

export const lmkRouter = router({
  create: authedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        // if the lmk is private to someone, leave this out
        cliqueId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Implementation for creating a new "lmk" item
      return { id: "new-id", content: input.content, userId: ctx.user.id };
    }),
});
