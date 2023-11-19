import { prisma } from '~/server/db';
import { extractSessions, getTotalDashboardProfit } from './utils';

export default async function getDashboard(id: string, isBacker: boolean) {
  const total = getTotalProfitOrLoss(id);
  const sessions = getRecentSessions(id, isBacker);
  const sessionCount = await getSessionCount(id, isBacker);
  const data = await Promise.all([total, sessions, sessionCount]);
  return { total: data[0], sessions: data[1], sessionCount: data[2] };
}

export async function getTotalProfitOrLoss(user_id: string) {
  const allBackedPots = await prisma.potAccess.findMany({
    where: {
      user_id: user_id,
      AND: {
        type: 1,
      },
    },
    include: {
      pot: {
        include: {
          sessions: {
            orderBy: { created_at: 'desc' },
            take: 1,
          },
        },
      },
    },
  });
  const sessions = extractSessions(allBackedPots);
  return getTotalDashboardProfit(sessions);
}

export async function getRecentSessions(user_id: string, isBacker: boolean) {
  const potAccess = await prisma.potAccess.findMany({
    where: { user_id: user_id, AND: { type: isBacker ? 1 : 0 } },
  });
  const potAccessIds = potAccess.map(access => access.pot_id);
  const sessions = await prisma.sessions.findMany({
    where: { pot_id: { in: potAccessIds } },
    take: 3,
    include: { user: { select: { username: true } } },
  });
  return sessions;
}

async function getSessionCount(userId: string, isBacker: boolean) {
  const date = new Date();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  const potsWithAccess = await prisma.potAccess.findMany({
    where: {
      user_id: userId,
      type: isBacker ? 1 : 0,
    },
    select: {
      pot_id: true,
    },
  });

  let totalSessions = 0;

  for (let i = 0; i < potsWithAccess.length; i++) {
    const sessionCount = await prisma.sessions.count({
      where: {
        pot_id: potsWithAccess[i]?.pot_id,
        created_at: {
          gte: firstDayOfMonth,
        },
      },
    });

    totalSessions += sessionCount;
  }

  return totalSessions;
}
