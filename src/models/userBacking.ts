import { db } from '@/lib/db';
import { UserBacking } from '@prisma/client';
import { PlayerOrBacker } from './types';

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
            orderBy: { created_at: 'desc' },
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
  console.log({ userId, backingId });

  const userBacking = await db.userBacking.findUnique({
    where: {
      user_id_backing_id: { user_id: userId, backing_id: backingId },
    },
  });
  console.log(userBacking);

  return userBacking?.type === 'BACKER';
}

export async function createUserBacking({
  userBacking,
  backerId,
}: {
  userBacking: Omit<UserBacking, 'id' | 'percent'>;
  backerId: string;
}) {
  const hasAccess = await isBackerForBacking({
    backingId: userBacking.backing_id,
    userId: backerId,
  });
  if (!hasAccess) {
    throw new Error('User does not have access to backing');
  }
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
  const percentageCheck = percentages.reduce((current, acc) => {
    return acc.percent + current;
  }, 0);
  if (percentageCheck !== 100) {
    throw new Error('Percentages do not add up to 100');
  }
  return db.$transaction(
    percentages.map(({ user_id, percent }) => {
      return db.userBacking.update({
        where: { user_id_backing_id: { user_id, backing_id: backingId } },
        data: { percent },
      });
    })
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
  return db.userBacking.delete({
    where: {
      user_id_backing_id: { user_id: userId, backing_id: backingId },
      backing: { access: { some: { user_id: backerId, type: 'BACKER' } } },
    },
  });
}

export function findAllUserBackings({ backingId }: { backingId?: number }) {
  const where = backingId ? { backing_id: backingId } : {};
  return db.userBacking.findMany({
    where,
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
  return db.userBacking.findUnique({
    where: { user_id_backing_id: { user_id: userId, backing_id: backingId } },
    select: {
      backing: {
        select: {
          _count: { select: { session: true } },
          session: {
            select: {
              id: true,
              amount: true,
              created_at: true,
              user_id: true,
              game_type: true,
              _count: {
                select: { comments: true },
              },
              location: true,
            },
          },
          chops: {
            select: {
              amount: true,
              created_at: true,
              user_id: true,
              chop_split: true,
            },
          },
          topUps: { select: { amount: true, created_at: true, user_id: true } },
          owner: true,
          float: true,
          name: true,
        },
      },
      type: true,
    },
  });
}
