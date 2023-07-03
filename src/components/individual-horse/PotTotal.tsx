import { api } from "~/utils/api";

export function PotTotal({ pot_id }: { pot_id: number }) {
  const { data, isLoading } = api.pots.getTotal.useQuery({ pot_id });
  if (isLoading) return null;
  return <div className="m-2 h-20 w-20 bg-white">total {data}</div>;
}
