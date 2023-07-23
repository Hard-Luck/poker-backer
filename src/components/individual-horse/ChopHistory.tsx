import { api } from "~/utils/api";
import ChopCard from "./ChopCard";

export default function ChopHistory({ pot_id }: { pot_id: number }) {
  const { data, isLoading } = api.pots.getChops.useQuery(
    { pot_id },
    { retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
  if (isLoading) return null;
  if (!data) return <p>No activity</p>;

  return (
    <div className="flex flex-col justify-around text-center align-middle text-black">
      <h2>Chop History</h2>
      <ul>
        {data.map((chop) => {
          return <ChopCard key={chop.id} chop={chop} />;
        })}
      </ul>
    </div>
  );
}

export function Username({ user_id }: { user_id: string }) {
  const { data, isLoading } = api.users.getUsernameById.useQuery(
    {
      id: user_id,
    },
    { retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
  if (isLoading) return null;
  if (!data) return <p>missing username</p>;
  return <span>{data.username}</span>;
}
