import type { InputPot } from "types/api";
import { prisma } from "~/server/db";
import { createPotAccess } from "./potAceess";


export async function getPotById(pot_id: number) {
    return prisma.pots.findUnique({ where: { id: pot_id }, include: { sessions: { orderBy: { created_at: 'desc' } } }, })
}
export async function createPot(pot: InputPot) {
    const newPot = await prisma.pots.create({ data: pot })
    await createPotAccess({ pot_id: newPot.id, type: 1, user_id: newPot.owner, percent: 100 })
    return newPot
}

export function getAllUsersPots(user_id: string) {
    return prisma.potAccess.findMany({
        where: { user_id },
        include: { pot: { select: { name: true, id: true } } }
    })
}