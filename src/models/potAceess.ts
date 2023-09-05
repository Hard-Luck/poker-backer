import type { InputPotAccess } from "types/api";
import { prisma } from "~/server/db";
import { isPotOwner } from "./pots";

export async function hasAccessToPot(userId: string, potId: number) {
    const potAccess = await prisma.potAccess.findFirst({
        where: {
            user_id: userId,
            pot_id: potId,
        },
    });
    return potAccess !== null;
}

export async function isBackerOfPot(userId: string, potId: number) {
    const potAccess = await prisma.potAccess.findFirst({
        where: {
            user_id: userId,
            pot_id: potId,
        },
    });
    return potAccess?.type === 1;
}

export async function createPotAccess(options: InputPotAccess) {
    return prisma.potAccess.create({
        data: options
    }
    );
}

export async function patchPercentages(potId: number, percentages: { user_id: string, percent: number }[]) {
    const percentageCheck = percentages.reduce((current, acc) => {
        return acc.percent + current;
    }, 0);
    if (percentageCheck !== 100) {
        throw new Error('Percentages do not add up to 100');
    }
    return prisma.$transaction(percentages.map(({ user_id, percent }) => {
        return prisma.potAccess.update({ where: { user_id_pot_id: { user_id, pot_id: potId } }, data: { percent } })
    }))

}

export async function getAccessByPotId(potId: number) {
    const access = await prisma.potAccess.findMany({
        where: {
            pot_id: potId
        }, include: { user: { select: { username: true, id: true } } }
    })
    return access.map(access => {
        const { percent, type } = access
        const { id, username } = access.user
        return { user_id: id, username, percent, type }
    })
}

export async function deleteAccessToPot(ownerId: string, userId: string, potId: number) {
    const isOwner = await isPotOwner(potId, ownerId)
    if (!isOwner) throw new Error('UNAUTHOIRISED')
    const access = await prisma.potAccess.findFirst({
        where: {
            user_id: userId,
            pot_id: potId,
        }
    })
    if (access?.percent !== 0) throw new Error("PERCENT_ERROR")
    const { count } = await prisma.potAccess.deleteMany({
        where: {
            user_id: userId,
            pot_id: potId,
            percent: 0
        }
    })
    if (count === 0) throw new Error('NO_ACCESS')

}


