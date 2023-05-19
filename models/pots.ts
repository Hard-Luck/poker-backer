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

export async function chop(pot_id: number, user_id: string) {
    const playersWithAccess = await prisma.potAccess.findMany({ where: { pot_id } })
    const pot = await prisma.pots.findUniqueOrThrow({
        where: { id: pot_id },
        include: { sessions: { orderBy: { created_at: 'desc' }, take: 1 } }
    })
    if (!pot.sessions[0]) throw new Error("No Sessions")
    const float = pot.float
    const total = pot.sessions[0].total
    const topUps = await getTopUpsSinceLastChop(pot_id)
    const topUpTotal = topUps.reduce((acc: number, curr) => {
        return acc + curr.amount
    }, 0)
    const amount = total - float
    const toSplit = amount - topUpTotal
    const split = playersWithAccess.reduce((acc: { [key: string]: number }, player) => {
        acc.user_id = toSplit * (player.percent / 100)
        return acc
    }, {})
    topUps.forEach(topUp => {
        split.user_id += topUp.amount
    })
    return prisma.chops.create({
        data: { chop_top: "chop", pot_id, split, user_id, amount }
    })
}


export async function getChopHistory(pot_id: number) {
    return prisma.chops.findMany({ where: { pot_id } })
}

export async function getLastChop(pot_id: number, withFloat = false) {
    return prisma.chops.findFirst({
        where: { pot_id },
        orderBy: { created_at: 'desc' },
    })

}

export async function getLastChopWithFloat(pot_id: number) {
    return prisma.chops.findFirst({
        where: { pot_id },
        orderBy: { created_at: 'desc' },
        include: { pot: { select: { float: true } } }
    })

}
export async function getTopUpsSinceLastChop(pot_id: number) {
    const lastChop = await getLastChop(pot_id)
    if (!lastChop) return []
    return prisma.chops.findMany({
        where: {
            pot_id,
            chop_top: "top_up",
            created_at: {
                gte: lastChop.created_at
            }
        }
    })
}