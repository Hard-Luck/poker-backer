import type { Sessions } from "@prisma/client";
import { convertMinsToHrsMins, formatShortDate } from "~/utils/timestamp";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
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
    <div className="rounded-lg bg-theme-grey text-theme-white">
      <h2 className="text-center text-2xl font-black">Recent Sessions</h2>
      {sessions.map((session) => {
        return (
          <div
            key={session.id}
            className="mx-auto my-4 grid max-w-xl grid-cols-5 flex-col gap-1 rounded-lg p-2"
          >
            <div className="col-auto self-end">{session.user.username}</div>
            <div className="col-auto self-end">
              {convertMinsToHrsMins(session.session_length ?? 0)}
            </div>
            <div
              className={`col-auto flex items-center self-end ${
                session.amount < 0 ? "text-theme-red" : "text-theme-green"
              }`}
            >
              {session.amount}
              {session.amount < 0 ? <ImArrowDown /> : <ImArrowUp />}
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
