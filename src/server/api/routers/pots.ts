

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const potsRouter = createTRPCRouter({
    getCurrentUserPot: privateProcedure
        .query(async ({ ctx }) => {
            const id = ctx.currentUserId as string;
            return prisma.potAccess.findMany({ where: { user_id: id, AND: { type: 0 } }, include: { pot: { select: { name: true } } } })
        }),
});