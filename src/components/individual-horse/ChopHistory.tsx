import { api } from '~/utils/api';
import ChopCard from './ChopCard';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function ChopHistory({ pot_id }: { pot_id: number }) {
  const { data, isLoading } = api.pots.getChops.useQuery(
    { pot_id },
    { retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
  if (isLoading) return null;
  if (!data) return <p>No activity</p>;

  return (
    <div className="flex flex-col justify-around bg-theme-black text-center align-middle text-white">
      <div className="relative">
        <Link href={`/stable/${pot_id}`}>
          <button className="absolute left-0 m-2 rounded-lg bg-theme-header p-2">
            <FiArrowLeft />
          </button>
        </Link>
        <h2 className="m-2 text-2xl">Chop History</h2>
      </div>
      <ul>
        {data.map(chop => {
          return <ChopCard key={chop.id} chop={chop} />;
        })}
      </ul>
    </div>
  );
}

export function Username({ user_id }: { user_id: string }) {
  const { data, isLoading } = api.users.getUsernameById.useQuery(
    {
      id: user_id,
    },
    { retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
  if (isLoading) return null;
  if (!data) return <p>missing username</p>;
  return <span>{data.username}</span>;
}
