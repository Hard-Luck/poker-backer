import { Backing, Session } from "@prisma/client";
import type { PotAccessWithPotAndSession } from "types/dashboard";

interface SessionsWithFloatsTotal {
  sessions: Array<Session>;
  float: number;
}
// untested
export function extractSessions(backedPots: PotAccessWithPotAndSession[]) {
  const sessionsWithFloats = backedPots.reduce(
    (acc, { pot }) => {
      const { float, sessions } = pot;
      acc.float += sessions.length ? float : 0;
      acc.sessions.push(...sessions);
      return acc;
    },
    { float: 0, sessions: [] } as SessionsWithFloatsTotal
  );
  return sessionsWithFloats;
}
export function getTotalDashboardProfit({
  float,
  sessions,
}: SessionsWithFloatsTotal) {
  const total = sumSessionsTotal(sessions);
  return total - float;
}

export function sumSessionsTotal(sessions: Session[]) {
  return sessions.reduce((total, session) => {
    return total + (session.total ?? 0);
  }, 0);
}

export function calculatePotProfit(pot: Backing, mostRecentSession?: Session) {
  const { float } = pot;
  if (!mostRecentSession) return 0;
  const { total, top_ups_total } = mostRecentSession;
  return total - float - top_ups_total;
}
export function calculateSplit(profit: number, players: PotAccess[]) {
  return players.reduce((acc: Record<string, number>, { user_id, percent }) => {
    acc[user_id] = profit * (percent / 100);
    return acc;
  }, {});
}
export function filterTopUps(sessions: Sessions[]) {
  return sessions.filter((session) => session.transaction_type === "top_up");
}
