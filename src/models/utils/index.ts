import type { PotAccess, Pots, Sessions } from "@prisma/client";
import type { PotAccessWithPotAndSession } from "types/dashboard";

// untested
export function extractSessions(backedPots: PotAccessWithPotAndSession[]) {
  return backedPots.reduce((sessions, access) => {
    const potSessions = access.pot.sessions ?? [];
    return [...sessions, ...potSessions];
  }, [] as Sessions[]);
}

export function sumSessionsTotal(sessions: Sessions[]) {
  return sessions.reduce((total, session) => {
    return total + (session.total ?? 0);
  }, 0);
}

export function calculatePotProfit(pot: Pots, mostRecentSession?: Sessions) {
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
