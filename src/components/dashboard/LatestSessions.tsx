import type { Sessions } from "@prisma/client";
import { convertMinsToHrsMins, formatShortDate } from "~/utils/timestamp";
interface UsernameAndId {
  user: {
    username: string;
  };
}
export default function RecentSession({
  sessions,
}: {
  sessions: Array<Sessions & UsernameAndId>;
}) {
  return (
    <div className="w-screen rounded-lg border-2 border-black p-2 text-theme-white">
      <h2 className="text-center text-2xl font-black">Recent Sessions</h2>
      {sessions.map((session) => {
        return (
          <div
            key={session.id}
            className="w-100 mx-auto my-4 grid max-w-xl grid-cols-5 flex-col gap-1 rounded-lg border-2 border-black p-2"
          >
            <div className="col-auto self-end">{session.user.username}</div>
            <div className="col-auto self-end">
              {convertMinsToHrsMins(session.session_length ?? 0)}
            </div>
            <div
              className={`col-auto self-end ${
                session.amount < 0 ? "text-theme-red" : "text-theme-green"
              }`}
            >
              {session.amount}
            </div>
            <div className="col-auto self-end">{session.total}</div>
            <div className="col-auto self-end">
              {formatShortDate(session.created_at)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
