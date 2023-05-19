import { useUser } from "@clerk/clerk-react";
import type { Sessions } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import Loading from "~/components/Loading";
import NotFound404 from "~/components/errors/NotFound";
import AddPlayerToPot from "~/components/pots/AddPlayerToPot";
import SettingsModal from "~/components/pots/SettingsModal";
import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/currency";
import { convertMinsToHrsMins, formatShortDate } from "~/utils/timestamp";

export default function Pot() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddToPotModalOpen, setIsAddToPotModalOpen] = useState(false);
  const pot_id = Number(useRouter().query.pot_id);
  const user = useUser();
  if (!pot_id || !user) return <Loading />;
  return (
    <div>
      <PotTable pot_id={pot_id} />
      <button onClick={() => setIsSettingsModalOpen(true)}>Settings</button>
      {isSettingsModalOpen && (
        <SettingsModal
          pot_id={pot_id}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
      <button onClick={() => setIsAddToPotModalOpen(true)}>
        Add Player to Pot
      </button>
      {isAddToPotModalOpen && <AddPlayerToPot pot_id={pot_id} />}
    </div>
  );
}

export function PotTable({ pot_id }: { pot_id: number }) {
  const { data, isLoading, error } = api.pots.getById.useQuery({ pot_id });
  if (error) return <NotFound404 />;
  if (isLoading) return <Loading />;
  const sessions = data?.sessions;
  return (
    <>
      <h2>
        {data?.name} Float: {data?.float}
      </h2>
      <table>
        <thead>
          <tr>
            <td>Date Played</td>
            <td>Session Length</td>
            <td>Amount</td>
            <td>Total</td>
          </tr>
        </thead>
        <tbody>
          {sessions?.map((session) => {
            return <SessionsTableRow key={session.id} session={session} />;
          })}
        </tbody>
      </table>
    </>
  );
}
export function SessionsTableRow({ session }: { session: Sessions }) {
  const { created_at, session_length, amount, total } = session;
  return (
    <tr>
      <td>{formatShortDate(created_at)}</td>
      <td>{convertMinsToHrsMins(session_length)}</td>
      <td>{formatCurrency(amount)}</td>
      <td>{formatCurrency(total)}</td>
    </tr>
  );
}
