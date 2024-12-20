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
