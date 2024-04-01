import { db } from "@/lib/db";

export default async function getDashboard(id: string) {
  const sessions = await getRecentSessions(id);
  //const sessionCount = await getSessionCount(id);
  //const data = await Promise.all([total, sessions, sessionCount]);
  return { sessions };
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
