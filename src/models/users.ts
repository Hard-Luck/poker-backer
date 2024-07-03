import { db } from '@/lib/db';


export async function getUserById(id: string) {
  return db.user.findFirst({
    where: { id },
    include: { receivedFriendships: true, sentFriendships: true },
  });
}

export async function searchNotFriendUserByPartialUsername(
  searchString: string,
  userId: string
) {
  if (searchString.length < 3) return [];
  return db.user.findMany({
    where: {
      username: { contains: searchString.toLowerCase() },
      id: { not: userId },
      sentFriendships: { none: { friend_id: userId } },
      receivedFriendships: { none: { user_id: userId } },
    },
    select: { id: true, username: true, img_url: true },
    take: 10,
  });
}
export async function getUsernameById(id: string) {
  const user = await db.user.findUnique({
    where: { id: id },
    select: { username: true },
  });
  if (!user) throw new Error('User not found');
  const { username } = user;
  return username;
}
export async function changeUsername(id: string, newUsername: string) {
  return db.user.update({
    where: { id: id },
    data: { username: newUsername },
  });
}

export async function changeImgUrl(url: string, user_id: string) {
  if (!url.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}/))
    throw new Error('Invalid URL');
  return db.user.update({
    where: { id: user_id },
    data: { img_url: url },
  });
}
