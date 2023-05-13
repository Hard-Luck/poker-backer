import { prisma } from "~/server/db";

export async function getUserById(id: string) {
    return prisma.userInfo.findUnique({ where: { id: id } });
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

