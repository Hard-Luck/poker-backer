import { protectedProcedure, router } from "@/lib/server/trpc";
import {
  createUserBacking,
  deleteUserBacking,
  findAllUserBackings,
  hasAccessToBacking,
  isBackerForBacking,
  patchPercentages,
} from "@/models/userBacking";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userBackingsRouter = router({
  listIndividual: protectedProcedure
    .input(
      z.object({
        backingId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { backingId } = input;
      const { session } = ctx;
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const userId = session.user.id;
      const hasAccess = await hasAccessToBacking({ backingId, userId });
      if (!hasAccess) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return findAllUserBackings({ backingId });
    }),
  update: protectedProcedure
    .input(
      z.object({
        backingId: z.number(),
        percentages: z.array(
          z.object({
            user_id: z.string(),
            percent: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { backingId, percentages } = input;
      const { session } = ctx;
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const userId = session.user.id;
      const hasAccess = await isBackerForBacking({ backingId, userId });

      if (!hasAccess) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const percentageCheck = percentages.reduce(
        (acc, { percent }) => acc + percent,
        0
      );
      if (percentageCheck !== 100) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      return patchPercentages({ backingId, percentages });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        backingId: z.number(),
        toRemoveId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { backingId, toRemoveId: userId } = input;
      const backerId = ctx.session.user.id;
      try {
        return deleteUserBacking({ userId, backerId, backingId });
      } catch {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),
  create: protectedProcedure
    .input(z.object({ friendId: z.string(), backingId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { friendId, backingId } = input;
      const backerId = ctx.session.user.id;
      return createUserBacking({
        userBacking: {
          backing_id: backingId,
          user_id: friendId,
          type: "PLAYER",
        },
        backerId,
      });
    }),
});
