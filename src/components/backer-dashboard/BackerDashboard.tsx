import { api } from "~/utils/api";
import { PotBar } from "./PotBar";
import { RecentSession } from "types/dashboard";
import { formatShortDate } from "~/utils/timestamp";

interface PlayerOverviewProps {
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
    <div className="grid grid-cols-4 gap-1">
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
    <div className="grid grid-cols-4 gap-1">
      <div className="col-auto self-start">{session.user.username}</div>
      <div className="col-auto self-end">{session.amount}</div>
      <div className="col-auto self-end">{session.total}</div>
      <div className="col-auto self-end">
        {formatShortDate(session.created_at)}
      </div>
    </div>
  );
}
export default function BackerDashboard({ userId }: { userId: string }) {
  const { data, isLoading } = api.backer.getDashboard.useQuery({ id: userId });
  if (isLoading) return <p>Loading data</p>;
  if (!data) return <p>Missing Data</p>;
  return (
    <div className=" flex flex-col">
      <div>
        <h2 className="text-center">Backed Players</h2>
        {data.players.map((player) => (
          <PlayerOverview player={player} />
        ))}
      </div>
      <div>
        <h2>Recent Sessions</h2>
        {data.sessions.map((session) => {
          return <RecentSession session={session} />;
        })}
      </div>
    </div>
  );
}
