import { prisma } from "~/server/db";

export async function getAllFriends(userId: string) {
    const friends = await prisma.friendship.findMany({
        where: {
            OR: [{ user_id: userId }, { friend_id: userId }],
        },
        include: {
            friend: { select: { username: true } },
            user: { select: { username: true } }
        }
    })
    return friends
}

async function friendRequestExists(user_id: string, friend_id: string) {
    const userSent = await prisma.friendship.findFirst({ where: { user_id, AND: { friend_id } } })
    const userReceived = await prisma.friendship.findFirst({ where: { user_id: friend_id, AND: { friend_id: user_id } } })
    return !!(userSent || userReceived);
}
export async function sendFriendRequest(user_id: string, friend_id: string) {
    if (await friendRequestExists(user_id, friend_id)) throw new Error("Request already sent");
    return prisma.friendship.create({ data: { user_id, friend_id } })
}
export async function acceptFriendRequest(sender: string, receiver: string) {
    const [user_id, friend_id] = [sender, receiver]
    console.log(user_id, friend_id);

    if (!await friendRequestExists(user_id, friend_id)) throw new Error("Request not found");
    return prisma.friendship.update({
        where: {
            user_id_friend_id: { user_id, friend_id }
        },
        data: { status: true }
    })
}
