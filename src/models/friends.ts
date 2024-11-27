import { db } from "@/lib/db";
export type FriendforFriendListWithImgUrl = {
  id: number;
  friend_id: string;
  userId: string;
  friend: {
    img_url: string | null;
    username: string;
  };
  status: boolean;
  created_at: Date;
};
export async function getAllFriends(userId: string) {
  const friendOriginallySentByUser = await db.friendship.findMany({
    where: {
      user_id: userId,
    },
    select: {
      user_id: true,
      friend_id: true,
      id: true,
      status: true,
      created_at: true,
      friend: {
        select: {
          img_url: true,
          username: true,
        },
      },
    },
  });
  const friendOriginallySentToUser = await db.friendship.findMany({
    where: {
      friend_id: userId,
    },
    select: {
      user_id: true,
      id: true,
      status: true,
      created_at: true,
      user: {
        select: {
          img_url: true,
          username: true,
        },
      },
    },
  });
  return [
    ...friendOriginallySentByUser.map(({ user_id, ...rest }) => {
      return {
        userId: user_id,
        ...rest,
      };
    }),
    ...friendOriginallySentToUser.map(
      ({ user, user_id, id, created_at, status }) => {
        return {
          id,
          userId: user_id,
          friend_id: userId,
          friend: user,
          created_at,
          status,
        };
      }
    ),
  ] as FriendforFriendListWithImgUrl[];
}

export async function getFriendRequests(userId: string) {
  const requests = await db.friendship.findMany({
    where: {
      OR: [{ user_id: userId }, { friend_id: userId }],
      AND: { status: true },
    },
    include: { user: { select: { img_url: true } } },
  });
  return requests;
}

async function friendRequestExists(user_id: string, friend_id: string) {
  const userSent = await db.friendship.findFirst({
    where: { user_id, AND: { friend_id } },
  });
  const userReceived = await db.friendship.findFirst({
    where: { user_id: friend_id, AND: { friend_id: user_id } },
  });
  return !!(userSent || userReceived);
}
export async function sendFriendRequest({
  user_id,
  friend_id,
}: {
  user_id: string;
  friend_id: string;
}) {
  if (await friendRequestExists(user_id, friend_id))
    throw new Error("Request already sent");
  return db.friendship.create({ data: { user_id, friend_id } });
}

export async function acceptFriendRequest({
  friendshipId,
}: {
  friendshipId: number;
}) {
  return db.friendship.update({
    where: { id: friendshipId },
    data: { status: true },
  });
}

export async function getFriendStatus(user_id: string, friend_id: string) {
  const status = await db.friendship.findFirst({
    where: {
      OR: [
        { user_id, friend_id },
        { user_id: friend_id, friend_id: user_id },
      ],
    },
    select: { status: true },
  });
  if (!status) return null;
  return status.status;
}

export async function getFriendsNotInBacking({
  user_id,
  backingId,
}: {
  user_id: string;
  backingId: number;
}) {
  const friends = await db.user.findUnique({
    where: { id: user_id },
    select: {
      receivedFriendships: {
        where: {
          status: true,
          user: {
            userBacking: {
              none: {
                backing_id: backingId,
              },
            },
          },
        },
        select: {
          user: {
            select: {
              username: true,
              img_url: true,
              id: true,
            },
          },
        },
      },
      sentFriendships: {
        where: {
          status: true,
          friend: {
            userBacking: {
              none: {
                backing_id: backingId,
              },
            },
          },
        },
        select: {
          friend: {
            select: {
              username: true,
              img_url: true,
              id: true,
            },
          },
        },
      },
    },
  });
  if (!friends) throw new Error("User not found");
  return friends;
}

export async function deleteFriendRequest({
  friendshipId,
}: {
  friendshipId: number;
}) {
  return db.friendship.delete({ where: { id: friendshipId } });
}

export async function canDeleteFriendRequest({
  friendshipId,
  user_id,
}: {
  friendshipId: number;
  user_id: string;
}) {
  const friendship = await db.friendship.findFirst({
    where: { id: friendshipId },
  });
  if (!friendship) return false;
  return friendship.user_id === user_id || friendship.friend_id === user_id;
}
