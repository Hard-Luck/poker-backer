import { Pots, Sessions } from "@prisma/client";
import { prisma } from "~/server/db";
import * as _ from "lodash"


export async function getBackerDashboard(id: string): Promise<[Pots[], Sessions[]]> {
    const backersPots = await prisma.pots.findMany({ where: { owner: id }, take: 5 })
    const backerPotIds = _.map(backersPots, "id")
    const recentSessions = await prisma.sessions.findMany({ where: { pot_id: { in: backerPotIds } }, take: 5 })
    return [backersPots, recentSessions]

}
