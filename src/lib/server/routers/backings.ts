import { protectedProcedure, router } from '@/lib/server/trpc';
import {
  createBacking,
  deleteBackingAsOwner,
  updateBackingFloat,
} from '@/models/backing';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const backingsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        float: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const owner = ctx.session.user.id;
      const { name, float } = input;
      return createBacking({ name, float, owner });
    }),
  delete: protectedProcedure
    .input(z.object({ backingId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { backingId } = input;
      const userId = ctx.session.user.id;

      try {
        await deleteBackingAsOwner({ backingId, userId });
        return true;
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to delete backing',
        });
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        backingId: z.number(),
        float: z.number().positive(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { backingId, float } = input;
      const userId = ctx.session.user.id;

      try {
        return updateBackingFloat({ backingId, float, userId });
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to update backing',
        });
      }
    }),
});
