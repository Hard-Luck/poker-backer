import { db } from "../lib/db";
import { getSessionAmounts } from "./sessions";
import { getTopUpAmounts } from "./topups";
import { ChopSplitRecord } from "./types";
import { findAllUserBackings, isBackerForBacking } from "./userBacking";

export async function chop({
  userId,
  backingId,
}: {
  userId: string;
  backingId: number;
}) {
  if (!(await isBackerForBacking({ userId, backingId })))
    throw new Error("Not a backer");
  const playersWithAccess = await findAllUserBackings({ backingId });
  const lastChop = await getLastChop(backingId);
  const lastChopDate = new Date(lastChop?.created_at || 0);
  const sessionsSinceLastChop = getSessionAmounts({
    backingId,
    after: lastChopDate,
  });

  const topUpsSinceLastChop = getTopUpAmounts({
    backingId,
    after: lastChopDate,
  });

  const [sessionAmounts, topUpAmounts] = await Promise.all([
    sessionsSinceLastChop,
    topUpsSinceLastChop,
  ]);

  const profit = sessionAmounts.reduce((acc, s) => acc + s.amount, 0);
  const topUpsTotal = topUpAmounts.reduce((acc, t) => acc + t.amount, 0);
  console.log({ profit, topUpsTotal });
  if (profit <= 0) throw new Error("Negative");

  const splits = playersWithAccess.reduce<ChopSplitRecord>(
    (acc, { user_id, percent, user }) => {
      acc[user_id] = {
        percent,
        username: user.username,
        split: profit * (percent / 100),
      };
      return acc;
    },
    {}
  );

  topUpAmounts.forEach(({ user_id, amount }) => {
    splits[user_id].split += amount;
  });

  return db.chop.create({
    data: {
      user_id: userId,
      backing_id: backingId,
      amount: profit,
      chop_split: JSON.stringify(splits),
    },
  });
}

export async function getChopHistory({
  backing_id,
  after = new Date(0),
}: {
  backing_id: number;
  after?: Date;
}) {
  const history = await db.chop.findMany({
    where: { backing_id, created_at: { gt: after } },
    orderBy: { created_at: "desc" },
    select: { amount: true, chop_split: true, created_at: true },
  });
  return history;
}

export async function getLastChop(backing_id: number) {
  return db.chop.findFirst({
    where: { backing_id },
    orderBy: { created_at: "desc" },
  });
}

export async function isBackingOwner(backing_id: number, user_id: string) {
  const backing = await db.backing.findFirst({ where: { id: backing_id } });
  return backing?.owner === user_id;
}
