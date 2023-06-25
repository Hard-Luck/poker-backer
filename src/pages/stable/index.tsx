import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import Loading from "~/components/Loading";
import CreatePotWizard from "~/components/stable/CreatePotWizard";
import { api } from "~/utils/api";

export default function Pots() {
  return (
    <SignedIn>
      <div className="mt-128 overflow-y-auto">
        <PotsList />
        <CreatePotWizard />
      </div>
    </SignedIn>
  );
}

export function PotsList() {
  const { data, isLoading } = api.pots.list.useQuery();
  if (isLoading) return <Loading />;
  if (!data) return <p>No pots yet</p>;
  return (
    <div className="m-2 flex flex-col">
      <h2 className="text-center">Pots you have access to</h2>
      {data.map((pot) => {
        return (
          <Link
            className="m-2 flex w-full justify-around self-center border-2 border-black p-2 text-center"
            key={pot.id}
            passHref={true}
            href={`/stable/${pot.pot_id}`}
          >
            <div className="">{pot.pot.name}</div>
          </Link>
        );
      })}
    </div>
  );
}
