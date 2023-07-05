import { api } from "~/utils/api";

export default function SessionCount({ pot_id }: { pot_id: number }) {
  const { data, isLoading } = api.sessions.sessionsSinceLastChop.useQuery({
    pot_id,
  });
  if (isLoading) return null;
  return (
    <div className="m-2 rounded-lg bg-theme-black p-1 text-center text-white">
      <div className=" text-xs">Sessions</div>
      <div className="text-xl font-bold"> {data}</div>
    </div>
  );
}
