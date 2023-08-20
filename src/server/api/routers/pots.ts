

import { TRPCError } from "@trpc/server";
import { hasAccessToPot, isBackerOfPot } from "~/models/potAceess";
import { chop, createPot, deletePot, getAllUsersPots, getChopHistory, getPotById, isPotOwner, topUpPot, } from "~/models/pots";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { getUserById } from "~/models/users";

export const potsRouter = createTRPCRouter({
    getCurrentUserPot: privateProcedure
        .query(async ({ ctx }) => {
            const id = ctx.currentUser
            return prisma.potAccess.findMany({ where: { user_id: id }, include: { pot: { select: { name: true } } } })
        }),
    create: privateProcedure
        .input(z.object(
            {
                name: z.string(),
                float: z.number(),
            }))
        .mutation(async ({ ctx, input }) => {
            const id = ctx.currentUser
            return createPot({ ...input, owner: id })
        }),
    list: privateProcedure.query(async ({ ctx }) => {
        const id = ctx.currentUser
        const user = await getUserById(id)
        return getAllUsersPots(ctx.currentUser, user.is_backer)
    }),

    getById: privateProcedure.input(z.object({ pot_id: z.number() })).query(async ({ ctx, input }) => {
        const id = ctx.currentUser
        const { pot_id } = input
        const hasAccess = await hasAccessToPot(id, pot_id)
        if (!hasAccess) throw new TRPCError({ code: "NOT_FOUND" })
        return getPotById(pot_id)

    }),
    chop: privateProcedure.input(z.object({ pot_id: z.number() })).mutation(async ({ ctx, input }) => {
        const id = ctx.currentUser
        const { pot_id } = input
        const isBacker = await isBackerOfPot(id, pot_id)
        if (!isBacker) throw new TRPCError({ code: "UNAUTHORIZED" })
        return chop(pot_id, id)
    }),
    getIsBackerOfPot: privateProcedure.input(z.object({ pot_id: z.number() })).query(async ({ ctx, input }) => {
        const id = ctx.currentUser
        const { pot_id } = input
        return isBackerOfPot(id, pot_id)

    }),
    getChops: privateProcedure.input(z.object({ pot_id: z.number() })).query(async ({ input }) => {
        const history = await getChopHistory(input.pot_id)
        return history
    }),
    topUp: privateProcedure.input(z.object({ pot_id: z.number(), amount: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const user_id = ctx.currentUser
            const { pot_id, amount } = input
            return topUpPot(pot_id, user_id, amount)
        }),
    delete: privateProcedure.input(z.object({ pot_id: z.number() })).mutation(async ({ input, ctx }) => {
        const { pot_id } = input
        const user_id = ctx.currentUser
        if (!(await isPotOwner(pot_id, user_id))) throw new TRPCError({ code: "FORBIDDEN" })
        return deletePot(pot_id)
    }),
    getTotal: privateProcedure.input(z.object({ pot_id: z.number() })).query(async ({ input }) => {
        const { pot_id } = input
        const pot = await getPotById(pot_id)
        const latestSession = pot?.sessions[0]
        console.log(latestSession)
        if (latestSession?.transaction_type === "chop") return 0
        return (latestSession?.total || 0) - (latestSession?.top_ups_total || 0) - (pot?.float || 0)
    })


})



