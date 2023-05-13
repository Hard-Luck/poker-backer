import { prisma } from "~/server/db";

export async function hasAccessToPot(userId: string, potId: number) {
    const potAccess = await prisma.potAccess.findFirst({
        where: {
            user_id: userId,
            pot_id: potId,
        },
    });
    return potAccess !== null;
}

