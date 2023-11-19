import { type Sessions } from '@prisma/client';
import { uniqueId } from 'lodash';
import { formatLongDate } from '~/utils/timestamp';
import { Username } from './ChopHistory';

export default function ChopCard({
  chop,
}: {
  chop: Sessions & {
    user: {
      username: string;
    };
  };
}) {
  return (
    <div className="mx-4 my-8">
      <h3 className="m-2 rounded-lg bg-slate-300 p-2 font-bold text-theme-black">
        {formatLongDate(chop?.created_at || new Date())}
      </h3>
      {chop?.chop_split &&
        Object.entries(chop?.chop_split)
          .filter(([id, amount]) => amount !== 0 && id != null)
          .map(([id, amount]) => {
            return (
              <div
                className="m-2 flex justify-between rounded-lg bg-theme-grey p-2"
                key={uniqueId()}
              >
                <div className="px-2">{<Username user_id={id} />} </div>
                <div className="px-2"> {amount}</div>
              </div>
            );
          })}
    </div>
  );
}
