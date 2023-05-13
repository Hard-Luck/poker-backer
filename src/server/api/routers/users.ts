import { getUserById, getUserByUsername, getUsernameById } from "models/users";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getCurrentUserInfo: privateProcedure.query(async ({ ctx }) => {
        return getUserById(ctx.currentUser)
    }),
    getCurrentUserName: privateProcedure.query(async ({ ctx }) => {
        const id = ctx.currentUser
        const username = getUsernameById(id)
        return username
    }),
    getUserByUsername: privateProcedure
        .input(z.object({ username: z.string() }))
        .query(async ({ input }) => {
            const { username } = input
            if (username.length < 3) throw new Error("Username must be at least 3 characters long")
            return getUserByUsername(username)
        }),

})
