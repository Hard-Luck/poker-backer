import type { UserInfo } from "@prisma/client";
import { prisma } from "~/server/db";

export async function createNewUserInfo(id: string, username: string, isBacker: boolean) {
    const user: UserInfo = { username, is_backer: isBacker, id: id, admin: false }
    return prisma.userInfo.create({ data: user })
}
export async function getUserById(id: string) {
    return prisma.userInfo.findUniqueOrThrow({ where: { id: id } });
}

export async function getUserByUsername(searchString: string) {
    return prisma.userInfo.findMany({ where: { username: { contains: searchString.toLowerCase() } } });
}
export async function getUsernameById(id: string) {
    const user = await prisma.userInfo.findUnique({
        where: { id: id }, select: { username: true }
    })
    if (!user) throw new Error("User not found")
    const { username } = user;
    return username
}


