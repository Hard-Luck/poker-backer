import { api } from "~/utils/api";

import { convertMinsToHrsMins, formatShortDate } from "~/utils/timestamp";
import { formatCurrency } from "~/utils/currency";
import ConfirmButton from "../confirm-button/ConfirmButton";
import type { Sessions } from "@prisma/client";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";

type SessionWithCount = Sessions & { _count: { comments: number } };

export function PotTable({ sessions }: { sessions: SessionWithCount[] }) {
  return (
    <div className=" gap-4 overflow-x-auto rounded-lg bg-theme-grey p-4">
      <div className="overflow-x-auto">
        <table className=" text-white ">
          <thead className="text-sm font-bold">
            <tr>
              <td className="text-center">Date</td>
              <td className="text-center">Session</td>
              <td className="text-center">Amount</td>
              <td className="text-center">Total</td>
              <td className="text-center">Comments</td>
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
    </div>
  );
}
export function SessionsTableRow({ session }: { session: SessionWithCount }) {
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
    <tr className="border-b-2 border-[#6b6b6b] ">
      <td className="text-center">{formatShortDate(created_at)}</td>
      <td className="text-center">{sessionDisplay}</td>
      <td className={`text-center text-${color}-500`}>
        {formatCurrency(amount)}
      </td>
      <td className="text-center">{formatCurrency(total)}</td>
      <td className="text-center">
        <Link href={`/sessions/${session.id}`}>{session._count.comments}</Link>
      </td>
      <td>
        <ConfirmButton
          buttonLabel={<FiTrash2 />}
          // confirmMessage="permanantly delete session?"
          disabled={isLoading}
          onConfirm={() => mutate({ id: session.id })}
          className="m-2 rounded-lg bg-theme-red p-1 text-white"
        />
      </td>
    </tr>
  );
}
