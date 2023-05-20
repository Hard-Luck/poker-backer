import { SignedIn, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Loading from "~/components/Loading";
import CreatePotWizard from "~/components/pots/CreatePotWizard";
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
    <div className="flex w-full flex-col gap-4  border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="self-center text-2xl font-bold text-white">
        Pots you have access to
      </h2>
      {data.map((pot) => {
        return (
          <Link
            className="flex w-full justify-around self-center text-center"
            key={pot.id}
            passHref={true}
            href={`/pots/${pot.pot.id}`}
          >
            <div className="text-centre w-3/4 rounded-lg border-2 border-cyan-100 p-2 text-xl font-bold text-blue-600 hover:underline dark:text-blue-400">
              {pot.pot.name}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
