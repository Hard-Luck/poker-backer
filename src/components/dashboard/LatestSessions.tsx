import type { Sessions } from '@prisma/client';
import { convertMinsToHrsMins, formatShortDate } from '~/utils/timestamp';
import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import React from 'react';
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
    <div className="w-80 rounded-lg bg-theme-grey p-2 text-theme-white">
      <h2 className="text-center text-2xl font-black">Recent Sessions</h2>
      <div className=" mx-auto my-4 grid  grid-cols-5 flex-col gap-2 rounded-lg pb-2 pl-6">
        <div></div>
        <div className="col-auto self-end">Mins</div>
        <div className={`col-auto flex items-center self-end`}>+/-</div>
        <div className="col-auto self-end">Total</div>
        <div className="col-auto self-end">Date</div>

        {sessions.map(session => {
          return (
            <React.Fragment key={session.id}>
              <div className="col-auto self-end">{session.user.username}</div>
              <div className="col-auto self-end">
                {convertMinsToHrsMins(session.session_length ?? 0)}
              </div>
              <div
                className={`col-auto flex items-center self-end ${
                  session.amount < 0 ? 'text-theme-red' : 'text-theme-green'
                }`}
              >
                {session.amount}
                {session.amount < 0 ? <ImArrowDown /> : <ImArrowUp />}
              </div>
              <div className="col-auto self-end">{session.total}</div>
              <div className="col-auto self-end">
                {formatShortDate(session.created_at)}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
