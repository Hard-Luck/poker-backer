import { Pots } from "@prisma/client";
import { prisma } from "~/server/db";

export async function getBackerDashboard(id: string): Promise<Pots[]> {
    const backersPots = await prisma.pots.findMany({ where: { owner: id }, take: 5 })
    return backersPots

}
