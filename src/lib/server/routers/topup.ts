import { protectedProcedure, router } from "@/lib/server/trpc";
import { topUpPot } from "@/models/topups";
import { z } from "zod";

export const topUpsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        backingId: z.number(),
        amount: z.number(),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { backingId, amount, note } = input;
      const userId = ctx.session.user.id;
      return topUpPot({ userId, backingId, amount, note });
    }),
});
