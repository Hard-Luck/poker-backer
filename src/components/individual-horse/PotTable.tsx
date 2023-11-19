import { api } from '~/utils/api';

import { convertMinsToHrsMins, formatShortDate } from '~/utils/timestamp';
import { formatCurrency } from '~/utils/currency';
import ConfirmButton from '../confirm-button/ConfirmButton';
import type { Sessions } from '@prisma/client';
import Link from 'next/link';
import { FiTrash2 } from 'react-icons/fi';
import { toastDefaultSuccess } from '../utils/default-toasts';

type SessionWithCount = Sessions & { _count: { comments: number } };

export function PotTable({ sessions }: { sessions: SessionWithCount[] }) {
  return (
    <div className=" flex h-[calc(100vh-17rem)] justify-center gap-4 overflow-y-auto rounded-lg bg-theme-grey p-4">
      <table className=" text-white ">
        <thead>
          <tr className="sticky top-0 bg-theme-grey text-sm font-bold">
            <td className="text-center">Date</td>
            <td className="text-center">Session</td>
            <td className="text-center">Amount</td>
            <td className="text-center">Total</td>
            <td className="text-center">Comments</td>
            <td className="text-center"></td>
          </tr>
        </thead>
        <tbody>
          {sessions?.map(session => {
            return <SessionsTableRow key={session.id} session={session} />;
          })}
        </tbody>
      </table>
    </div>
  );
}
export function SessionsTableRow({ session }: { session: SessionWithCount }) {
  const ctx = api.useContext();
  const { mutate, isLoading } = api.sessions.delete.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
      toastDefaultSuccess('Session deleted');
    },
  });

  const { created_at, session_length, amount, total, transaction_type } =
    session;
  let colorSetting = amount > 0 ? 'green' : 'red';
  const style: {
    [key: string]: string;
  } = {
    green: `text-center text-theme-green`,
    red: `text-center text-theme-red`,
    top_up: `text-center text-lg`,
    chop: `text-center text-theme-gold text-lg`,
  };
  if (transaction_type === 'top_up' || transaction_type === 'chop') {
    colorSetting = transaction_type;
  }
  const sessionDisplay = !!session_length
    ? convertMinsToHrsMins(session_length)
    : transaction_type.replace('_', ' ').toUpperCase();
  return (
    <tr className="border-b-2 border-[#6b6b6b] text-sm">
      <td className="text-center">{formatShortDate(created_at)}</td>
      <td className="text-center">{sessionDisplay}</td>
      <td className={style[colorSetting] || `text-center`}>
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
