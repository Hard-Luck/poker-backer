import { api } from "~/utils/api";
import Loading from "../Loading";
import NotFound404 from "~/components/errors/NotFound";
import { type Sessions } from "@prisma/client";
import { convertMinsToHrsMins, formatShortDate } from "~/utils/timestamp";
import { formatCurrency } from "~/utils/currency";
import ConfirmButton from "../confirm-button/ConfirmButton";

export function PotTable({ pot_id }: { pot_id: number }) {
  const { data, isLoading, error } = api.pots.getById.useQuery(
    { pot_id },
    { retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
  if (error) return <NotFound404 page="player" />;
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
            <td className="text-center"></td>
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
  const { mutate, isLoading, isSuccess } = api.sessions.delete.useMutation();
  const ctx = api.useContext();
  if (isSuccess) {
    void ctx.invalidate();
  }
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
      <td>
        <ConfirmButton
          buttonLabel="🚮"
          confirmMessage="permanantly delete session?"
          disabled={isLoading}
          onConfirm={() => mutate({ id: session.id })}
          className="text-red-500"
        />
      </td>
    </tr>
  );
}
