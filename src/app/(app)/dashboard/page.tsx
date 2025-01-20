import * as React from "react";
import { getUserAuth } from "@/lib/auth/utils";
import getDashboard from "@/models/dashboard";
import SessionsThisMonth from "./SessionsThisMonth";
import RecentSession from "./RecentSessions";
import HistoryLink from "./HistoryLink";
import FriendsLink from "./FriendsLink";
import AddSessionLink from "./AddSessionLink";

export default async function Page() {
  const { session } = getUserAuth();
  if (!session) throw new Error("No session found");
  const user = await getDashboard(session.user.id);
  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] gap-4">
      <div className="flex flex-col gap-2 self-center">
        <SessionsThisMonth />
        <div className="flex flex-row gap-2">
          <HistoryLink />
          <FriendsLink />
          <AddSessionLink />
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <RecentSession sessions={user.sessions} />
      </div>
    </main>
  );
}
