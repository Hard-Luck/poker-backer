import { prisma } from "~/server/db";

export async function createNewUserInfo(id: string, username: string, isBacker: boolean) {
    const user = { username, is_backer: isBacker, id: id, admin: false }
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
export async function changeUsername(id: string, newUsername: string) {
    return prisma.userInfo.update({ where: { id: id }, data: { username: newUsername } })
}

export async function changeIsBacker(id: string, isBacker: boolean) {
    return prisma.userInfo.update({ where: { id: id }, data: { is_backer: isBacker } })
}
