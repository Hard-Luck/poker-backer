import { api } from "~/utils/api";

export default function NoneSessionHistory({ pot_id }: { pot_id: number }) {
  const { data, isLoading } = api.pots.getChops.useQuery({ pot_id });
  if (isLoading) return null;
  if (!data) return <p>No activity</p>;
  return (
    <div className="flex flex-col justify-around text-center align-middle text-white">
      <h2>Chop History</h2>
      <ul>
        {data.map((event) => (
          <li key={event.id}>
            {event.transaction_type} - {event.amount} - {event.user.username}
            {event.chop_split &&
              Object.entries(event.chop_split).map(
                ([id, value]: [string, number]) => {
                  return (
                    <div key={id}>
                      {<Username user_id={id} />} - £{value.toFixed(2)}
                    </div>
                  );
                }
              )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Username({ user_id }: { user_id: string }) {
  const { data, isLoading } = api.users.getUsernameById.useQuery({
    id: user_id,
  });
  if (isLoading) return null;
  if (!data) return <p>missing username</p>;
  return <span>{data.username}</span>;
}
