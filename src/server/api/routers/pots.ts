

import { TRPCError } from "@trpc/server";
import { hasAccessToPot, isBackerOfPot } from "models/potAceess";
import { chop, createPot, getAllUsersPots, getChopHistory, getPotById, topUpPot, } from "models/pots";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const potsRouter = createTRPCRouter({
    getCurrentUserPot: privateProcedure
        .query(async ({ ctx }) => {
            const id = ctx.currentUser
            return prisma.potAccess.findMany({ where: { user_id: id, AND: { type: 0 } }, include: { pot: { select: { name: true } } } })
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
        return getAllUsersPots(ctx.currentUser)
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
        })
})


