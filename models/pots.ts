import type { InputPot } from "types/api";
import { prisma } from "~/server/db";
import { createPotAccess, isBackerOfPot } from "./potAceess";
import { getLastSession } from "./sessions";


export async function getPotBasicInfo(pot_id: number) {
    return prisma.pots.findUnique({ where: { id: pot_id } })
}
export async function getPotById(pot_id: number) {
    return prisma.pots.findUnique({ where: { id: pot_id }, include: { sessions: { orderBy: { created_at: 'desc' } } }, })
}
export async function createPot(pot: InputPot) {
    const newPot = await prisma.pots.create({ data: pot })
    await createPotAccess({ pot_id: newPot.id, type: 1, user_id: newPot.owner, percent: 100 })
    return newPot
}

export async function getAllUsersPots(user_id: string) {
    const pots = await prisma.potAccess.findMany({
        where: { user_id, type: 1 },
        select: { pot_id: true }
    })
    const potIds = pots.map(pot => pot.pot_id)
    const potData = await prisma.potAccess.findMany({
        where: { pot_id: { in: potIds } },
        include: { pot: { select: { name: true, float: true } } },
        distinct: ['pot_id']
    })


    return potData



}

export async function chop(pot_id: number, user_id: string) {
    if (!(await isBackerOfPot(user_id, pot_id))) throw new Error("Not a backer")
    const playersWithAccess = await prisma.potAccess.findMany({ where: { pot_id } })
    const pot = await getPotDataSinceLastChop(pot_id)
    if (!pot.sessions[0]) throw new Error("No Sessions")
    const recentSession = pot.sessions[0]
    const topUps = pot.sessions.filter(session => session.transaction_type === "top_up")
    const float = pot.float
    const total = recentSession.total
    const amount = total - float - pot.sessions[0].top_ups_total
    const toSplit = amount
    if (toSplit <= 0) throw new Error("Negative")
    const split = playersWithAccess.reduce((acc: { [key: string]: number }, player) => {
        acc[player.user_id] = toSplit * (player.percent / 100)
        return acc
    }, {})
    topUps.forEach(topUp => {
        split.user_id += topUp.amount
    })
    return prisma.sessions.create({
        data: {
            user_id,
            pot_id,
            transaction_type: "chop",
            amount,
            chop_split: split,
            top_ups_total: 0,
            total: float
        }
    })
}


export async function getChopHistory(pot_id: number, take = 10) {
    const history = await prisma.sessions.findMany({
        where: { pot_id, transaction_type: "chop" },
        take: take,
        include: {
            user: { select: { username: true } }
        }
    })
    return history
}

export async function getLastChop(pot_id: number) {
    return prisma.sessions.findFirst({
        where: { pot_id, transaction_type: "chop" },
        orderBy: { created_at: 'desc' },
    })
}



export async function topUpPot(pot_id: number, user_id: string, amount: number) {
    if (!(await isBackerOfPot(user_id, pot_id))) throw new Error("Not a backer")
    const lastTransaction = await getLastSession(pot_id)
    return prisma.sessions.create({
        data: {
            user_id,
            pot_id,
            transaction_type: "top_up",
            amount,
            top_ups_total: lastTransaction?.top_ups_total ? lastTransaction.top_ups_total + amount : amount,
            total: lastTransaction?.total ? lastTransaction.total + amount : amount
        }
    })

}

export async function getPotDataSinceLastChop(pot_id: number) {
    const lastChop = await getLastChop(pot_id)
    const lastChopDate = lastChop?.created_at
    if (!lastChopDate) {
        return prisma.pots.findUniqueOrThrow({
            where: { id: pot_id }, include: { sessions: { orderBy: { created_at: 'desc' } } }
        })
    }
    return prisma.pots.findUniqueOrThrow({
        where: { id: pot_id },
        include: {
            sessions: {
                where: { created_at: { gt: lastChopDate } },
                orderBy: { created_at: 'desc' }
            }
        }
    })
}
export async function isPotOwner(pot_id: number, user_id: string) {
    const pot = await prisma.pots.findFirst({ where: { id: pot_id } })
    return pot?.owner === user_id
}
export async function deletePot(pot_id: number) {
    return prisma.pots.delete({ where: { id: pot_id } })
}