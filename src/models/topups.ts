import { db } from "@/lib/db";
import { isBackerForBacking } from "./userBacking";

export async function getTopUpAmounts({
  backingId,
  after = new Date(0),
}: {
  backingId: number;
  after?: Date;
}) {
  return db.topUp.findMany({
    where: { backing_id: backingId, created_at: { gt: after } },
    select: { amount: true, created_at: true, user_id: true },
  });
}

export async function topUpPot({
  backingId,
  userId,
  amount,
  note,
}: {
  backingId: number;
  userId: string;
  amount: number;
  note?: string;
}) {
  if (!(await isBackerForBacking({ userId, backingId })))
    throw new Error("Not a backer");
  const topUp = await db.topUp.create({
    data: {
      user_id: userId,
      backing_id: backingId,
      amount,
      note,
    },
  });
  await db.backing.update({
    where: { id: backingId },
    data: { float: { increment: amount } },
  });
  return topUp;
}

export async function deleteTopup({ topupId }: { topupId: string }) {
  const topUp = await db.topUp.delete({ where: { id: topupId } });
  await db.backing.update({
    where: { id: topUp.backing_id },
    data: { float: { decrement: topUp.amount } },
  });
  return topUp;
}
