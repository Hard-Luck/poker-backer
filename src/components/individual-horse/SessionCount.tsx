import { api } from "~/utils/api";

export default function SessionCount({ pot_id }: { pot_id: number }) {
  const { data, isLoading } = api.sessions.sessionsSinceLastChop.useQuery({
    pot_id,
  });
  if (isLoading) return null;
  return <div className="m-2 h-20 w-20 bg-white">sessions {data}</div>;
}
