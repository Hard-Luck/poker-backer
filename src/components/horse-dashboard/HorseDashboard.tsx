import { api } from "~/utils/api";
import { formatShortDate } from "~/utils/timestamp";

function HorseDashboard({ userId }: { userId: string }) {
  const { data, isLoading } = api.horse.getDashboard.useQuery({ id: userId });
  if (isLoading) return <p>Loading data</p>;
  if (!data) return <p>Missing Data</p>;
  const pots = data.map((access) => {
    return access.pot;
  });
  return (
    <div>
      <h2>{data[0]?.pot.sessions[0]?.user.username || "No Sessions"}</h2>
      <div>
        {pots.map((pot) => {
          return (
            <div key={pot.id}>
              <h3>{pot.name}</h3>
              <p>{pot.float}</p>
              <div>
                {pot.sessions.map((session) => {
                  return (
                    <div key={session.id}>
                      <div>{session.amount}</div>
                      <div>{session.total}</div>;
                      <div>{session.session_length}</div>;
                      <div>{formatShortDate(session.created_at)}</div>;
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HorseDashboard;
