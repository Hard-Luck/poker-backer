import { TRPCError } from "@trpc/server"
import { prisma } from "~/server/db"
import { hasAccessToPot } from "./potAceess"
import { getLastChop, getPotById } from "./pots"
import { isDateAfter } from "~/utils/timestamp"

interface AddSessionInput {
    pot_id: number,
    amount: number,
    created_at: Date,
    session_length: number
}

export async function addSession(user_id: string, session: AddSessionInput) {
    const { amount, pot_id, session_length, created_at } = session
    const pot = await getPotById(pot_id)
    if (!pot) throw new TRPCError({ code: "NOT_FOUND" })
    const hasAccess = await hasAccessToPot(user_id, pot_id)
    if (!hasAccess) throw new TRPCError({ code: "FORBIDDEN" })
    const lastChop = await getLastChop(pot_id)
    const currentTotal = await prisma.sessions.findFirst({
        where: { pot_id: pot_id },
        orderBy: { created_at: 'desc' },
    })
    let total = 0;
    if (!lastChop) total = currentTotal?.total || pot.float
    if (lastChop && currentTotal && isDateAfter(lastChop.created_at, currentTotal.created_at)) {
        total = pot.float
    }
    total += amount

    return prisma.sessions.create({ data: { user_id, amount, pot_id, session_length, created_at, total } })
}