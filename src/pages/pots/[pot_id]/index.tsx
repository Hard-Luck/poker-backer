import { SignedIn } from "@clerk/nextjs";
import type { Sessions } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import Loading from "~/components/Loading";
import ConfirmButton from "~/components/confirm-button/ConfirmButton";
import IsBacker from "~/components/confirm-button/IsBacker";
import NotFound404 from "~/components/errors/NotFound";
import AddPlayerToPot from "~/components/pots/AddPlayerToPot";
import ChopButton from "~/components/pots/ChopButton";
import NoneSessionHistory from "~/components/pots/ChopHistory";
import SettingsModal from "~/components/pots/SettingsModal";
import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/currency";
import { convertMinsToHrsMins, formatShortDate } from "~/utils/timestamp";

export default function Pot() {
  const pot_id = Number(useRouter().query.pot_id);
  if (!pot_id) return <Loading />;
  return (
    <SignedIn>
      <div className="flex flex-col gap-4  border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ">
        <PotTable pot_id={pot_id} />
        <IsBacker pot_id={pot_id}>
          <Modals pot_id={pot_id} />
          <TopUpWizard pot_id={pot_id} />
        </IsBacker>
      </div>
    </SignedIn>
  );
}
export function Modals({ pot_id }: { pot_id: number }) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddToPotModalOpen, setIsAddToPotModalOpen] = useState(false);

  return (
    <div className="m-40 flex flex-col gap-4 border-2 border-gray-200  bg-white dark:border-gray-700 dark:bg-gray-800 ">
      <div className="self-center">
        <button
          className="m-4 my-1  h-12 w-56 rounded-lg  bg-blue-500 px-4  font-bold text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-gray-200 dark:hover:bg-blue-800 dark:hover:text-white"
          onClick={() => setIsSettingsModalOpen(true)}
        >
          Settings
        </button>
        {isSettingsModalOpen && (
          <SettingsModal
            pot_id={pot_id}
            onClose={() => setIsSettingsModalOpen(false)}
          />
        )}
      </div>
      <div className="self-center">
        <button
          className="m-4 my-1  h-12 w-56 rounded-lg  bg-blue-500 px-4  font-bold text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-gray-200 dark:hover:bg-blue-800 dark:hover:text-white"
          onClick={() => setIsAddToPotModalOpen(true)}
        >
          Add Player to Pot
        </button>
        {isAddToPotModalOpen && (
          <AddPlayerToPot
            onClose={() => setIsAddToPotModalOpen(false)}
            pot_id={pot_id}
          />
        )}
      </div>
      <div className="self-center">
        <ChopButton pot_id={pot_id} />
      </div>
      <NoneSessionHistory pot_id={pot_id} />
    </div>
  );
}

export function PotTable({ pot_id }: { pot_id: number }) {
  const { data, isLoading, error } = api.pots.getById.useQuery(
    { pot_id },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  if (error) return <NotFound404 />;
  if (isLoading) return <Loading />;
  const sessions = data?.sessions;
  return (
    <div className="flex  w-full flex-col gap-4 border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-center text-2xl font-bold text-white">
        Pot Name: {data?.name} Float: {data?.float}
      </h2>
      <table className="mr-4 text-white">
        <thead>
          <tr>
            <td className="text-center">Date Played</td>
            <td className="text-end">Session Length</td>
            <td className="text-end">Amount</td>
            <td className="text-end">Total</td>
          </tr>
        </thead>
        <tbody>
          {sessions?.map((session) => {
            return <SessionsTableRow key={session.id} session={session} />;
          })}
        </tbody>
      </table>
    </div>
  );
}
export function SessionsTableRow({ session }: { session: Sessions }) {
  const { created_at, session_length, amount, total, transaction_type } =
    session;
  let color = amount > 0 ? "green" : "red";
  if (["chop", "top_up"].includes(transaction_type)) color = "white";
  const sessionDisplay = !!session_length
    ? convertMinsToHrsMins(session_length)
    : transaction_type;
  return (
    <tr>
      <td className="text-center">{formatShortDate(created_at)}</td>
      <td className="text-end">{sessionDisplay}</td>
      <td className={`text-end text-${color}-500`}>{formatCurrency(amount)}</td>
      <td className="text-end">{formatCurrency(total)}</td>
    </tr>
  );
}

export function TopUpWizard({ pot_id }: { pot_id: number }) {
  const [amount, setAmount] = useState<number | "">("");
  const { isSuccess, isLoading, mutate } = api.pots.topUp.useMutation();
  const ctx = api.useContext();
  if (!mutate) return null;
  if (isSuccess) {
    void ctx.pots.invalidate();
  }
  const handleConfirm = () => {
    if (amount !== "") {
      mutate({ pot_id, amount });
      setAmount("");
    }
  };
  return (
    <div className="flex w-48 flex-col items-center justify-center gap-4 self-center  border-2 border-gray-200 bg-white p-4 text-right dark:border-gray-700 dark:bg-gray-800">
      <input
        className="text-right"
        type="number"
        value={amount ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "") {
            setAmount("");
          } else {
            setAmount(Number(e.target.value));
          }
        }}
      />
      <ConfirmButton
        buttonLabel="Top Up"
        onConfirm={handleConfirm}
        disabled={isLoading}
        className="w-32 rounded-sm bg-blue-500 text-white"
        confirmMessage={
          amount !== ""
            ? `Are you sure you want to top up this pot by ${formatCurrency(
                amount
              )}`
            : "You must enter an amount to top up this pot"
        }
      />
    </div>
  );
}
