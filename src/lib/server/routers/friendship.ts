import { protectedProcedure, router } from "@/lib/server/trpc";
import {
  acceptFriendRequest,
  canDeleteFriendRequest,
  deleteFriendRequest,
  getFriendsNotInBacking,
  sendFriendRequest,
} from "@/models/friends";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const friendshipsRouter = router({
  acceptFriendRequest: protectedProcedure
    .input(
      z.object({
        friendshipId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { friendshipId } = input;
      return acceptFriendRequest({ friendshipId });
    }),
  create: protectedProcedure
    .input(z.object({ friend_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { friend_id } = input;
      const user_id = ctx.session.user.id;
      return sendFriendRequest({ friend_id, user_id });
    }),
  listNotInBacking: protectedProcedure
    .input(z.object({ backingId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { backingId } = input;
      const user_id = ctx.session.user.id;
      return getFriendsNotInBacking({ user_id, backingId });
    }),
  delete: protectedProcedure
    .input(z.object({ friendshipId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { friendshipId } = input;
      const user_id = ctx.session.user.id;
      if (!(await canDeleteFriendRequest({ friendshipId, user_id }))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this friend request",
        });
      }
      return deleteFriendRequest({ friendshipId });
    }),
});
