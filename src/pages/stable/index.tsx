import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import Loading from "~/components/Loading";
import CreatePotWizard from "~/components/stable/CreatePotWizard";
import { api } from "~/utils/api";
import { AiOutlineFileAdd } from "react-icons/ai";

export type CreatePotWizardType = {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Pots() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <SignedIn>
      <div className="mt-128 h-screen overflow-y-auto bg-theme-black text-white">
        <PotsList setModalIsOpen={setModalIsOpen} />
        <CreatePotWizard
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
        />
      </div>
    </SignedIn>
  );
}

export function PotsList({
  setModalIsOpen,
}: {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data, isLoading } = api.pots.list.useQuery();
  if (isLoading) return <Loading />;
  if (!data) return <p>No pots yet</p>;
  return (
    <div className="m-2 flex flex-col ">
      <div className="flex justify-between p-2">
        <h2 className="p-3 text-xl font-semibold">My Pots</h2>
        <button
          className="rounded-lg bg-theme-header px-2 text-2xl text-white"
          onClick={() => setModalIsOpen(true)}
        >
          <AiOutlineFileAdd />
        </button>
      </div>
      {data.map((pot) => {
        return (
          <Link
            className="m-2 flex justify-center rounded-lg bg-theme-grey p-4 "
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
