import { protectedProcedure, router } from '@/lib/server/trpc';
import { deleteTopup, topUpPot } from '@/models/topups';
import { isBackerForBacking } from '@/models/userBacking';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

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
  delete: protectedProcedure
    .input(z.object({ topupId: z.string(), backingId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { topupId } = input;
      if (!(await isBackerForBacking({ userId, backingId: input.backingId }))) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      return deleteTopup({ topupId });
    }),
});
