import { useRouter } from "next/router";
import Loading from "~/components/Loading";
import IsBacker from "~/components/confirm-button/IsBacker";
import { Modals } from "~/components/individual-horse/Modals";
import { PotTable } from "~/components/individual-horse/PotTable";
import { PotTotal } from "~/components/individual-horse/PotTotal";
import SessionCount from "~/components/individual-horse/SessionCount";
import { api } from "~/utils/api";
import NotFound404 from "~/components/errors/NotFound";
import Link from "next/link";
import { HasAccess } from "~/components/utils/HasAccess";

export default function Pot() {
  const pot_id = Number(useRouter().query.pot_id);

  const { data, isLoading, error } = api.pots.getById.useQuery(
    { pot_id },
    { retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
  if (!pot_id) return <Loading />;
  if (error) return <NotFound404 page="player" />;
  if (isLoading) return <Loading />;
  const topUps = data?.sessions[0]?.top_ups_total ?? 0;
  const float = data?.float ?? 0;
  return (
    <HasAccess pot_id={pot_id}>
      <div className="h-[calc(100vh-4rem)] bg-theme-black p-4 ">
        <div className=" mb-2 grid grid-cols-7 rounded-lg bg-theme-grey p-4 text-white">
          <div className="col-span-4 flex flex-col justify-between ">
            <div>
              <div className=" text-xs">Pot Name</div>
              <div className="text-xl font-bold">{data?.name}</div>
              <div className=" text-xs">Float</div>
              <div className="text-xl font-bold">{float + topUps}</div>
            </div>
            <div className="">
              <IsBacker pot_id={pot_id}>
                <Modals pot_id={pot_id} />
              </IsBacker>
            </div>
          </div>
          <div className="col-span-3">
            <SessionCount pot_id={pot_id} />
            <PotTotal pot_id={pot_id} />
            <button className="w-full rounded-lg bg-theme-green p-2 text-center text-sm text-white">
              <Link href={`/stable/${pot_id}/chops`}>Chop History</Link>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center"></div>

        {data?.sessions && <PotTable sessions={data.sessions} />}
      </div>
    </HasAccess>
  );
}
