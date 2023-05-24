import { TRPCError } from "@trpc/server"
import { prisma } from "~/server/db"
import { hasAccessToPot } from "./potAceess"
import { getLastChop, getPotBasicInfo } from "./pots"


interface AddSessionInput {
    pot_id: number,
    amount: number,
    created_at: Date,
    session_length: number
}

export async function addSession(user_id: string, session: AddSessionInput) {
    const { amount, pot_id, session_length, created_at } = session
    const hasAccess = await hasAccessToPot(user_id, pot_id)
    if (!hasAccess) throw new TRPCError({ code: "FORBIDDEN" })
    const potMostRecentSession = await getLastSession(pot_id)
    const potInfo = await getPotBasicInfo(pot_id)
    if (!potInfo) throw new TRPCError({ code: "NOT_FOUND" })
    let total = potMostRecentSession?.total ?? potInfo.float
    total += amount

    return prisma.sessions.create({ data: { user_id, amount, pot_id, session_length, created_at, total } })
}

export async function getSessionsSinceLastChop(pot_id: number) {
    const lastChop = await getLastChop(pot_id)
    const sessions = await prisma.sessions.findFirst({
        where: {
            pot_id: pot_id, AND: { created_at: { gt: lastChop?.created_at } }
        }
    })
    return sessions
}
export async function getLastSession(pot_id: number) {
    return prisma.sessions.findFirst({
        where: { pot_id },
        orderBy: { created_at: 'desc' },
    })
}