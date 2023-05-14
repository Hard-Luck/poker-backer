

import { TRPCError } from "@trpc/server";
import { hasAccessToPot } from "models/potAceess";
import { getAllUsersPots, getPotById } from "models/pots";
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
            return prisma.pots.create({ data: { name: input.name, float: input.float, owner: id } })
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
})