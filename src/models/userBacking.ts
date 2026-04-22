import { db } from "@/lib/db";
import { type UserBacking } from "@prisma/client";
import { type PlayerOrBacker } from "./types";

export async function hasAccessToBacking({
  userId,
  backingId,
}: {
  userId: string;
  backingId: number;
}) {
  const userBacking = await db.userBacking.findFirst({
    where: {
      user_id: userId,
      backing_id: backingId,
    },
  });
  return userBacking !== null;
}

export async function getBackingsForUser(userId: string) {
  const userBackings = await db.userBacking.findMany({
    where: {
      user_id: userId,
    },
    select: {
      backing: {
        select: {
          id: true,
          name: true,
          session: {
            select: { created_at: true },
            orderBy: { created_at: "desc" },
            take: 1,
          },
        },
      },
      type: true,
    },
  });
  return userBackings.map(({ backing: { id, name, session }, type }) => {
    return {
      id,
      name,
      type: type as PlayerOrBacker,
      lastSession: session[0]?.created_at,
    };
  });
}

export type BackingsForUserList = Awaited<
  ReturnType<typeof getBackingsForUser>
>;

export async function isBackerForBacking({
  userId,
  backingId,
}: {
  userId: string;
  backingId: number;
}) {
  const userBacking = await db.userBacking.findFirst({
    where: {
      user_id: userId,
      backing_id: backingId,
      type: "BACKER",
    },
  });
  return userBacking !== null;
}

export async function createUserBacking({
  userBacking,
  backerId,
}: {
  userBacking: Omit<UserBacking, "id" | "percent">;
  backerId: string;
}) {
  const isBacker = await isBackerForBacking({
    userId: backerId,
    backingId: userBacking.backing_id,
  });
  if (!isBacker) throw new Error("Not authorized");
  return db.userBacking.create({
    data: userBacking,
  });
}

export async function patchPercentages({
  backingId,
  percentages,
}: {
  backingId: number;
  percentages: { user_id: string; percent: number }[];
}) {
  return db.$transaction(
    percentages.map(({ user_id, percent }) =>
      db.userBacking.update({
        where: { user_id_backing_id: { user_id, backing_id: backingId } },
        data: { percent },
      })
    )
  );
}

export async function deleteUserBacking({
  userId,
  backerId,
  backingId,
}: {
  userId: string;
  backerId: string;
  backingId: number;
}) {
  const isBacker = await isBackerForBacking({
    userId: backerId,
    backingId,
  });
  if (!isBacker) throw new Error("Not authorized");
  return db.userBacking.delete({
    where: { user_id_backing_id: { user_id: userId, backing_id: backingId } },
  });
}

export function findAllUserBackings({ backingId }: { backingId?: number }) {
  return db.userBacking.findMany({
    where: { backing_id: backingId },
    include: { user: { select: { username: true } } },
  });
}

export async function findBackingWithSessionsChopsAndTopUps({
  backingId,
  userId,
}: {
  backingId: number;
  userId: string;
}) {
  const userBacking = await db.userBacking.findFirst({
    where: {
      user_id: userId,
      backing_id: backingId,
    },
    include: {
      backing: {
        include: {
          _count: { select: { session: true } },
          session: { orderBy: { created_at: "desc" } },
          chops: { orderBy: { created_at: "asc" } },
          topUps: { orderBy: { created_at: "desc" } },
        },
      },
    },
  });
  if (!userBacking) return null;
  return userBacking;
}
