import getDashboard from "~/models/dashboard";
import { changeIsBacker, changeUsername, createNewUserInfo, getUserById, getUserByUsername, getUsernameById } from "~/models/users";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({
    getDashboard: privateProcedure.input(z.object({ isBacker: z.boolean() })).query(async ({ input, ctx }) => {
        const id = ctx.currentUser
        const { isBacker } = input
        return getDashboard(id, isBacker)
    }),
    create: privateProcedure.input(z.object({ username: z.string().max(30).min(3), isBacker: z.boolean() })).mutation(async ({ input, ctx }) => {
        const { username } = input
        const id = ctx.currentUser
        return createNewUserInfo(id, username, input.isBacker)
    }),
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
            if (!input.username) return []
            const { username } = input
            if (username.length < 3) throw new Error("Username must be at least 3 characters long")
            return getUserByUsername(username)
        }),
    getUsernameById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        return prisma.userInfo.findFirstOrThrow({ where: { id: input.id } })
    }),
    updateUsername: privateProcedure
        .input(z.object({ username: z.string().max(30).min(5) }))
        .mutation(async ({ input, ctx }) => {
            const { username } = input
            const id = ctx.currentUser
            return changeUsername(id, username)
        }),
    updateIsBacker: privateProcedure
        .input(z.object({ isBacker: z.boolean() }))
        .mutation(async ({ input, ctx }) => {
            const id = ctx.currentUser
            const { isBacker } = input
            return changeIsBacker(id, isBacker)
        }),
    updateImgUrl: privateProcedure.input(z.object({ img_url: z.string() })).mutation(async ({ input, ctx }) => {
        const { img_url } = input
        const id = ctx.currentUser
        return prisma.userInfo.update({ where: { id }, data: { img_url } })

    })
}

)


