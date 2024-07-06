import { getUserAuth } from '@/lib/auth/utils';
import { getSessionsPlayedThisMonth } from '@/models/sessions';

export default async function SessionsThisMonth() {
  const { session } = getUserAuth();
  if (!session) throw new Error('No session found');
  const sessionsPlayedThisMonth = await getSessionsPlayedThisMonth(
    session.user.id
  );
  const sessionOrSessions = `${
    sessionsPlayedThisMonth > 1 ? 'Sessions' : 'Session'
  }`;
  return (
    <div className="h w-7/16 m-2 flex flex-col bg-primary items-center justify-center rounded p-2 ">
      <span className="text-sm font-bold">{sessionOrSessions} this month</span>
      <span className="text-4xl font-black">{sessionsPlayedThisMonth}</span>
    </div>
  );
}
