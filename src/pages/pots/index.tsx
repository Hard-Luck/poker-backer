import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { api } from "~/utils/api";

export default function Pots() {
  const user = useUser();
  if (!user) return null;
  return (
    <div>
      <PotsList />
    </div>
  );
}

export function PotsList() {
  const { data, isLoading } = api.pots.list.useQuery();
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <p>No pots yet</p>;
  return (
    <div>
      {data.map((pot) => {
        return (
          <Link key={pot.id} passHref={true} href={`/pots/${pot.pot.id}`}>
            <span>{pot.pot.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
