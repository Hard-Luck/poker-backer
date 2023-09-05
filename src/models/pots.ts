import type { InputPot } from "types/api";
import { prisma } from "~/server/db";
import { createPotAccess, isBackerOfPot } from "./potAceess";
import { getLastSession } from "./sessions";
import { calculatePotProfit, calculateSplit, filterTopUps } from "./utils";

export async function getPotBasicInfo(pot_id: number) {
  return prisma.pots.findUnique({ where: { id: pot_id } });
}
export async function getPotById(pot_id: number) {
  return prisma.pots.findUnique({
    where: { id: pot_id },
    include: {
      sessions: {
        orderBy: { created_at: "desc" },
        include: { _count: { select: { comments: true } } },
      },
    },
  });
}
export async function createPot(pot: InputPot) {
  const newPot = await prisma.pots.create({ data: pot });
  await createPotAccess({
    pot_id: newPot.id,
    type: 1,
    user_id: newPot.owner,
    percent: 100,
  });
  return newPot;
}

export async function getAllUsersPots(user_id: string, backer: boolean) {
  const pots = await prisma.potAccess.findMany({
    where: { user_id, type: backer ? 1 : 0 },
    select: { pot_id: true },
  });
  const potIds = pots.map((pot) => pot.pot_id);
  const potData = await prisma.potAccess.findMany({
    where: { pot_id: { in: potIds } },
    include: { pot: { select: { name: true, float: true } } },
    distinct: ["pot_id"],
  });

  return potData;
}
async function getPlayersWithPotAccess(pot_id: number) {
  return prisma.potAccess.findMany({
    where: { pot_id },
  });
}
export async function chop(pot_id: number, user_id: string) {
  if (!(await isBackerOfPot(user_id, pot_id))) throw new Error("Not a backer");

  const playersWithAccess = await getPlayersWithPotAccess(pot_id);
  const pot = await getPotDataSinceLastChop(pot_id);

  if (!pot.sessions[0]) throw new Error("No Sessions");

  const recentSession = pot.sessions[0];
  const topUps = filterTopUps(pot.sessions);
  const profit = calculatePotProfit(pot, recentSession);

  if (profit <= 0) throw new Error("Negative");

  const split = calculateSplit(profit, playersWithAccess);

  topUps.forEach(({ user_id, amount }) => {
    split[user_id] += amount;
  });

  return prisma.sessions.create({
    data: {
      user_id,
      pot_id,
      transaction_type: "chop",
      amount: profit,
      chop_split: split,
      top_ups_total: 0,
      total: pot.float,
    },
  });
}

export async function getChopHistory(pot_id: number, take = 10) {
  const history = await prisma.sessions.findMany({
    where: { pot_id, transaction_type: "chop" },
    take: take,
    include: {
      user: { select: { username: true } },
    }, orderBy: { created_at: "desc" }
  });
  return history;
}

export async function getLastChop(pot_id: number) {
  return prisma.sessions.findFirst({
    where: { pot_id, transaction_type: "chop" },
    orderBy: { created_at: "desc" },
  });
}

export async function topUpPot(
  pot_id: number,
  user_id: string,
  amount: number
) {
  if (!(await isBackerOfPot(user_id, pot_id))) throw new Error("Not a backer");
  const lastTransaction = await getLastSession(pot_id);
  return prisma.sessions.create({
    data: {
      user_id,
      pot_id,
      transaction_type: "top_up",
      amount,
      top_ups_total: lastTransaction?.top_ups_total
        ? lastTransaction.top_ups_total + amount
        : amount,
      total: lastTransaction?.total ? lastTransaction.total + amount : amount,
    },
  });
}

export async function getPotDataSinceLastChop(pot_id: number) {
  const lastChop = await getLastChop(pot_id);
  const lastChopDate = lastChop?.created_at;
  if (!lastChopDate) {
    return prisma.pots.findUniqueOrThrow({
      where: { id: pot_id },
      include: { sessions: { orderBy: { created_at: "desc" } } },
    });
  }
  return prisma.pots.findUniqueOrThrow({
    where: { id: pot_id },
    include: {
      sessions: {
        where: { created_at: { gt: lastChopDate } },
        orderBy: { created_at: "desc" },
      },
    },
  });
}
export async function isPotOwner(pot_id: number, user_id: string) {
  const pot = await prisma.pots.findFirst({ where: { id: pot_id } });
  return pot?.owner === user_id;
}
export async function deletePot(pot_id: number) {
  return prisma.pots.delete({ where: { id: pot_id } });
}
