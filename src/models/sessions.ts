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

    return prisma.sessions.create({ data: { user_id, amount, pot_id, session_length, created_at, total, top_ups_total: potMostRecentSession?.top_ups_total } })
}

export async function getSessionsSinceLastChop(pot_id: number) {
    const lastChop = await getLastChop(pot_id)
    const sessions = await prisma.sessions.findMany({
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

export async function deleteSession(session_id: number) {
    const session = await prisma.sessions.findUnique({ where: { id: session_id } })
    if (!session || !session.pot_id) throw new TRPCError({ code: "NOT_FOUND" })
    if (!(await canDeleteSession(session_id, session.user_id))) throw new TRPCError({ code: "FORBIDDEN" })
    if (session.transaction_type === "cash_game") {
        return prisma.$transaction(
            [
                prisma.sessions.delete({ where: { id: session_id } }),
                prisma.sessions.updateMany({
                    where: {
                        pot_id: session.pot_id,
                        AND: { created_at: { gt: session.created_at } }
                    }, data: { total: { decrement: session.amount } }
                })
            ])
    }
    if (session.transaction_type === "top_up") {
        return prisma.$transaction(
            [
                prisma.sessions.delete({ where: { id: session_id } }),
                prisma.sessions.updateMany({
                    where: {
                        pot_id: session.pot_id,
                        AND: { created_at: { gt: session.created_at } }
                    }, data: { top_ups_total: { decrement: session.amount } }
                })
            ])
    }
    throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
}


export async function canDeleteSession(session_id: number, user_id: string) {
    const session = await prisma.sessions.findFirst({ where: { id: session_id } })
    const lastChop = await prisma.sessions.findFirst({
        where: {
            id: session_id,
            AND: { transaction_type: "chop" }
        }
    })
    if (session?.user_id === user_id) return true
    if (!session) throw new TRPCError({ code: "NOT_FOUND" })
    if (lastChop && lastChop.created_at > session.created_at) return false
    const pot_id = session.pot_id
    const potAccess = await prisma.potAccess.findFirst({ where: { pot_id, user_id } })
    const isBacker = potAccess?.type === 1
    if (isBacker) return true
    return false
}

export async function getSessionWithComments(session_id: number) {
    return prisma.sessions.findFirst({
        where: { "id": session_id }, include: {
            comments: {
                include: {
                    user: {
                        select: { username: true, img_url: true }
                    }
                }
            }
        }
    })
}
export async function addComment(user_id: string, session_id: number, body: string) {
    return prisma.sessionComments.create({ data: { user_id, session_id, body } })
}
export async function deleteComment(comment_id: number) {
    return prisma.sessionComments.delete({ where: { id: comment_id } })
}