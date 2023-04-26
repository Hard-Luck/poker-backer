import { prisma } from "~/server/db";

export function getUserById(id: string) {
    return prisma.userInfo.findUnique({ where: { id: id } });
}
