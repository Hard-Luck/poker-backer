import { protectedProcedure, router } from "@/lib/server/trpc";
import { chop } from "@/models/chops";
import { z } from "zod";

export const chopsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        backingId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { backingId } = input;
      const userId = ctx.session.user.id;
      return chop({ userId, backingId });
    }),
});
