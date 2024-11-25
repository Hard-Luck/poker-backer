import { protectedProcedure, router } from "@/lib/server/trpc";
import {
  createBacking,
  deleteBackingAsOwner,
  getBackingHistory,
  updateBackingFloat,
} from "@/models/backing";
import { isBackerForBacking } from "@/models/userBacking";
import { parseBackingHistoryToCsv } from "@/utils/data-parse";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
          code: "BAD_REQUEST",
          message: "Failed to delete backing",
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
          code: "BAD_REQUEST",
          message: "Failed to update backing",
        });
      }
    }),
  getAllBackings: protectedProcedure
    .input(z.object({ backingId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!(await isBackerForBacking({ userId, backingId: input.backingId }))) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a backer for this backing",
        });
      }

      const history = await getBackingHistory(input.backingId);
      const csv = parseBackingHistoryToCsv(history);
      return { data: csv };
    }),
});
