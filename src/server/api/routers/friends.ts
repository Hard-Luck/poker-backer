
import { acceptFriendRequest, getAllFriends, sendFriendRequest } from "models/friends";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const friendsRouter = createTRPCRouter({
    getUserFriends: privateProcedure
        .query(async ({ ctx }) => {
            const id = ctx.currentUser
            return getAllFriends(id)
        }),
    create: privateProcedure
        .input(z.object({ friend_id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const user_id = ctx.currentUser
            const { friend_id } = input
            return sendFriendRequest(user_id, friend_id)
        }),
    accept: privateProcedure
        .input(z.object({ sender: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const receiver = ctx.currentUser
            const { sender } = input
            return acceptFriendRequest(sender, receiver)
        })

});