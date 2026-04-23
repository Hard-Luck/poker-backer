import { db } from "@/lib/db";

export async function getPotBasicInfo(backing_id: number) {
  return db.backing.findUnique({ where: { id: backing_id } });
}

export async function createBacking({
  name,
  float,
  owner,
}: {
  name: string;
  float: number;
  owner: string;
}) {
  const newPot = await db.backing.create({
    data: {
      name,
      float,
      owner,
      access: { create: { type: "BACKER", user_id: owner, percent: 100 } },
    },
  });

  return newPot;
}

export async function deleteBackingAsOwner({
  backingId,
  userId,
}: {
  backingId: number;
  userId: string;
}) {
  return db.backing.delete({
    where: {
      id: backingId,
      owner: userId,
    },
  });
}

export async function updateBackingFloat({
  backingId,
  float,
  userId,
}: {
  backingId: number;
  float: number;
  userId: string;
}) {
  return db.backing.update({
    where: { id: backingId, owner: userId },
    data: { float },
  });
}

export async function getBackingHistory(backing_id: number) {
  return db.backing.findFirst({
    where: { id: backing_id },
    include: {
      access: { include: { user: true } },
      chops: true,
      session: true,
      topUps: true,
    },
  });
}

/**
 * Fetches the full history for a backing using parallel queries.
 * Split from the page RSC to avoid Vercel function timeout on large floats.
 */
export async function getHistoryForBacking(backingId: number) {
  const [sessions, chops, topUps] = await Promise.all([
    db.session.findMany({
      where: { backing_id: backingId },
      orderBy: { created_at: "desc" },
      take: 500,
      select: {
        id: true,
        user_id: true,
        amount: true,
        created_at: true,
        game_type: true,
        location: true,
      },
    }),
    db.chop.findMany({
      where: { backing_id: backingId },
      orderBy: { created_at: "desc" },
      take: 200,
      select: {
        id: true,
        user_id: true,
        amount: true,
        created_at: true,
        chop_split: true,
        note: true,
      },
    }),
    db.topUp.findMany({
      where: { backing_id: backingId },
      orderBy: { created_at: "desc" },
      take: 200,
      select: {
        id: true,
        user_id: true,
        amount: true,
        created_at: true,
        note: true,
      },
    }),
  ]);
  return { sessions, chops, topUps };
}
