import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { Expo } from "expo-server-sdk";
import { z } from "zod";
import { user } from "../db/auth-schema";
import { authedProcedure, extractAuth } from "../middleware/auth-middleware";
import { publicProcedure, router } from "../trpc";
import { cliqueRouter } from "./clique";
import { lmkRouter } from "./lmk";

export const appRouter = router({
  lmk: lmkRouter,
  clique: cliqueRouter,

  me: publicProcedure.use(extractAuth).query(({ ctx }) => {
    return ctx.user ?? null;
  }),

  expoPushToken: authedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(({ ctx, input }) => {
      if (Expo.isExpoPushToken(input.token))
        ctx.db
          .update(user)
          .set({ token: input.token })
          .where(eq(user.id, ctx.user.id));
      else
        throw new TRPCError({
          message: "Invalid Expo Push Token",
          code: "PRECONDITION_FAILED",
        });
    }),

  greet: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input }) => {
      return `Hello, ${input.name}!`;
    }),
});
