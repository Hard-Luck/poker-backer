import { api } from "~/utils/api";
import { formatShortDate } from "~/utils/timestamp";
import Loading from "../Loading";
import { RecentSession } from "types/dashboard";
import { formatCurrency } from "~/utils/currency";

function RecentSession({ session }: { session: RecentSession }) {
  return (
    <div className="mx-auto my-4 grid w-80 max-w-xl grid-cols-3 flex-col gap-1 rounded-lg p-2 align-middle text-white shadow-lg shadow-gray-500/50 dark:bg-gray-800 dark:text-gray-200">
      <div className="col-auto self-end">
        {formatShortDate(session.created_at)}
      </div>
      <div
        className={`col-auto self-end ${
          session.amount < 0 ? "text-red-500" : "text-green-500"
        }`}
      >
        {formatCurrency(session.amount)}
      </div>
      <div className="col-auto self-end">{formatCurrency(session.total)}</div>
    </div>
  );
}
export default function HorseDashboard({ userId }: { userId: string }) {
  const { data, isLoading } = api.horse.getDashboard.useQuery({ id: userId });
  if (isLoading) return <Loading />;
  if (!data || !data[0]?.pot.sessions) return <p>Missing Data</p>;

  return (
    <div className="mx-auto flex h-screen w-full max-w-xl flex-col gap-4 bg-gray-700 p-0 pb-2 align-middle text-white shadow-lg shadow-gray-500/50 dark:bg-gray-800 dark:text-gray-200">
      <div>
        <h2 className="text-center text-2xl font-bold">Recent Sessions</h2>
        {data[0]?.pot.sessions.map((session) => {
          return <RecentSession key={session.id} session={session} />;
        })}
      </div>
    </div>
  );
}
