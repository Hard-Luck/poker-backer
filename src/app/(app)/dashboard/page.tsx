import * as React from 'react';
import { getUserAuth } from '@/lib/auth/utils';
import getDashboard from '@/models/dashboard';
import SessionsThisMonth from './SessionsThisMonth';
import AddSessionButton from './AddSessionButton';
import RecentSession from './RecentSessions';
import HistoryLink from './HistoryLink';
import FriendsLink from './FriendsLink';

export default async function Page() {
  const { session } = await getUserAuth();
  if (!session) throw new Error('No session found');
  const user = await getDashboard(session.user.id);
  return (
    <main className="flex flex-col text-primary-foreground">
      <div className="flex flex-col self-center p-5">
        <SessionsThisMonth />
        <div className="flex ">
          <HistoryLink />
          <FriendsLink />
        </div>
        <AddSessionButton />
      </div>
      <RecentSession sessions={user.sessions} />
    </main>
  );
}
