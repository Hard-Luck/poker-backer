import { type Sessions } from "@prisma/client";
import { uniqueId } from "lodash";
import { formatShortDate } from "~/utils/timestamp";
import { Username } from "./ChopHistory";

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
    <div className="border-black-100">
      <p>{formatShortDate(chop?.created_at || new Date())}</p>
      {chop?.chop_split &&
        Object.entries(chop?.chop_split)
          .filter(([id, amount]) => amount !== 0 && id != null)
          .map(([id, amount]) => {
            return (
              <div key={uniqueId()}>
                {<Username user_id={id} />} - {amount}
              </div>
            );
          })}
    </div>
  );
}
