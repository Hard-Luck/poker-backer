import { extractSessions, getTotalDashboardProfit } from "./utils";
import { db } from "@/lib/db";

export default async function getDashboard(id: string) {
  const sessions = await getRecentSessions(id);
  //const sessionCount = await getSessionCount(id);
  //const data = await Promise.all([total, sessions, sessionCount]);
  return { sessions };
}

export async function getTotalProfitOrLoss(user_id: string) {
  const allBackedPots = await db.userBacking.findMany({
    where: {
      user_id: user_id,
    },
    include: {
      backing: {
        include: {
          session: {
            orderBy: { created_at: "desc" },
            take: 1,
          },
        },
      },
    },
  });
  const sessions = extractSessions(allBackedPots);
  return getTotalDashboardProfit(sessions);
}

export async function getRecentSessions(user_id: string) {
  const sessions = await db.userBacking.findMany({
    where: {
      user_id: user_id,
    },
    include: {
      backing: {
        include: {
          session: {
            orderBy: { created_at: "desc" },
            take: 3,
            include: { user: true },
          },
        },
      },
    },
  });
  return sessions
    .map((backing) => backing.backing.session)
    .flat()
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
}

async function getSessionCount(userId: string, isBacker: boolean) {
  const date = new Date();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  const potsWithAccess = await db.userBacking.findMany({
    where: {
      user_id: userId,
    },
    select: {
      backing_id: true,
    },
  });

  let totalSessions = 0;

  for (let i = 0; i < potsWithAccess.length; i++) {
    const sessionCount = await db.session.count({
      where: {
        backing_id: potsWithAccess[i]?.backing_id,
        created_at: {
          gte: firstDayOfMonth,
        },
      },
    });

    totalSessions += sessionCount;
  }

  return totalSessions;
}
