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
export async function getAcceptedFriends(userId: string) {
    const acceptedSentRequests = await prisma.friendship.findMany({
        where: { user_id: userId, status: true },
        include: { friend: { select: { username: true } } }

    })
    const formattedAcceptedRequest = acceptedSentRequests.map(request => {
        return {
            username: request.friend.username,
            id: request.friend_id
        }
    })
    const acceptedReceivedRequests = await prisma.friendship.findMany({
        where: { friend_id: userId, status: true },
        include: { friend: { select: { username: true } }, user: { select: { username: true } } }

    })
    const formattedReceivedRequest = acceptedReceivedRequests.map(request => {
        return {
            username: request.user.username,
            id: request.user_id
        }
    })
    return [...formattedAcceptedRequest, ...formattedReceivedRequest]
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
    if (!await friendRequestExists(user_id, friend_id)) throw new Error("Request not found");
    return prisma.friendship.update({
        where: {
            user_id_friend_id: { user_id, friend_id }
        },
        data: { status: true }
    })
}
export async function getFriendStatus(user_id: string, friend_id: string) {
    const status = await prisma.friendship.findFirst({
        where: {
            OR: [{ user_id, friend_id }, { user_id: friend_id, friend_id: user_id }],
        },
        select: { status: true }
    })
    if (!status) return null;
    return status.status;
}