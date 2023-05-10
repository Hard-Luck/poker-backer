import { prisma } from "~/server/db";
import * as _ from "lodash"
import { BackedPlayer } from "types/dashboard";
import { Sessions } from "@prisma/client";
import { access } from "fs";
import { number } from "zod";
export async function getPlayerOverView(user_id: string) {
    const result = await prisma.potAccess.findMany({
        where: {
            user_id: user_id,
            AND: {
                type: 1,
            },
        },
        include: {
            pot: {
                include: {
                    sessions: {
                        orderBy: { created_at: 'desc' },
                        take: 1,
                        include: { user: true }
                    },
                },
            },
        },
    });

    return result.map((pot) => {
        const username = pot.pot.sessions[0]?.user.username
        const pot_id = pot.pot.id
        const float = pot.pot.float
        const total = pot.pot.sessions[0]?.total
        const percentage = pot.percent
        const user_id = pot.pot.sessions[0]?.user_id
        return { username, pot_id, float, total, percentage, user_id } as BackedPlayer
    })
}

export async function getRecentSessionsForBacker(user_id: string) {
    const potAccess = await prisma.potAccess.findMany({ where: { user_id: user_id, AND: { type: 1 } } })
    const potAccessIds = potAccess.map(access => access.pot_id)
    const sessions = await prisma.sessions.findMany({
        where: { pot_id: { in: potAccessIds } },
        take: 5,
        include: { user: { select: { username: true } } },
    });
    return sessions
}
export async function getBackerDashboard(user_id: string) {
    const players = await getPlayerOverView(user_id)
    const sessions = await getRecentSessionsForBacker(user_id)
    return { players, sessions }
};




