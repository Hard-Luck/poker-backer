import { api } from "~/utils/api";

export function PotTotal({ pot_id }: { pot_id: number }) {
  const { data, isLoading } = api.pots.getTotal.useQuery({ pot_id });
  if (isLoading) return null;
  return (
    <div className="m-2 rounded-lg  bg-theme-black p-1 text-white text-center">
      <div className=" text-xs">Total</div>
      <div className="text-xl font-bold"> {data}</div>
    </div>
  );
}
