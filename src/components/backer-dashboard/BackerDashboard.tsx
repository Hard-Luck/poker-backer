import React from "react";
import { api } from "~/utils/api";
import { PotBar } from "./PotBar";
import { RecentSession } from "types/dashboard";
import { formatShortDate } from "~/utils/timestamp";
import Loading from "../Loading";
import { uniqueId } from "lodash";

export interface PlayerOverviewProps {
  player: {
    username: string;
    float: number;
    user_id: string;
    pot_id: number;
    total: number;
  };
}

function PlayerOverview({ player }: PlayerOverviewProps) {
  return (
    <div className="mx-auto my-4 grid w-80 max-w-xl grid-cols-4 flex-col gap-1 rounded-lg p-2 text-white shadow-lg shadow-gray-500/50 dark:bg-gray-800 dark:text-gray-200">
      <div className="col-auto self-start">{player.username}</div>
      <div className="col-auto self-end">{player.float}</div>
      <div className="col-auto self-end">{player.total}</div>
      <div className="self-end">
        <PotBar float={player.float} total={player.total} />
      </div>
    </div>
  );
}

function RecentSession({ session }: { session: RecentSession }) {
  return (
    <div className="mx-auto my-4 grid w-80 max-w-xl grid-cols-4 flex-col gap-1 rounded-lg p-2 text-white shadow-lg shadow-gray-500/50 dark:bg-gray-800 dark:text-gray-200">
      <div className="col-auto self-end">{session?.user?.username}</div>
      <div
        className={`col-auto self-end ${
          session.amount < 0 ? "text-red-500" : "text-green-500"
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
}

export default function BackerDashboard({ userId }: { userId: string }) {
  const { data, isLoading } = api.backer.getDashboard.useQuery({ id: userId });
  if (isLoading) return <Loading />;
  if (!data || !data.players) return <p>Missing Data</p>;
  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col gap-4 bg-gray-700 p-0 pb-2 text-white shadow-lg shadow-gray-500/50 dark:bg-gray-800 dark:text-gray-200">
      <div>
        <h2 className="text-center text-2xl font-bold">Backed Players</h2>
        {data.players.length > 0 ? (
          data.players.map((player) => (
            <PlayerOverview key={uniqueId()} player={player} />
          ))
        ) : (
          <p>No players found.</p>
        )}
      </div>
      <div>
        <h2 className="text-center text-2xl font-bold">Recent Sessions</h2>
        {data.sessions.length > 0 ? (
          data.sessions.map((session) => (
            <RecentSession key={session.id} session={session} />
          ))
        ) : (
          <p>No recent sessions found.</p>
        )}
      </div>
    </div>
  );
}
