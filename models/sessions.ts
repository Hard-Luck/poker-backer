import { TRPCError } from "@trpc/server"
import { prisma } from "~/server/db"
import { hasAccessToPot } from "./potAceess"

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
    const currentTotal = await prisma.sessions.findFirst({
        where: { pot_id: pot_id },
        orderBy: { created_at: 'desc' },
    }) || { total: 0 }

    const total = currentTotal.total + amount
    return prisma.sessions.create({ data: { user_id, amount, pot_id, session_length, created_at, total } })
}