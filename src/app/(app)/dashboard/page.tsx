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
    <main className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      {/* Dashboard Content */}
      <div className="flex-1 container mx-auto px-4 py-6 md:py-8 flex flex-col gap-6">
        {/* Stats and Quick Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-6 items-stretch">
          {/* Sessions This Month Card */}
          <SessionsThisMonth />
          
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            <HistoryLink />
            <FriendsLink />
            <AddSessionLink />
          </div>
        </div>
        
        {/* Recent Sessions Section */}
        <div className="flex-1 min-h-0">
          <RecentSession sessions={user.sessions} />
        </div>
      </div>
    </main>
  );
}
