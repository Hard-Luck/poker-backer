import { SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Loading from "~/components/Loading";
import IsBacker from "~/components/confirm-button/IsBacker";
import { Modals } from "~/components/individual-horse/Modals";
import { PotTable } from "~/components/individual-horse/PotTable";
import { PotTotal } from "~/components/individual-horse/PotTotal";
import SessionCount from "~/components/individual-horse/SessionCount";
import { api } from "~/utils/api";
import NotFound404 from "~/components/errors/NotFound";

export default function Pot() {
  const pot_id = Number(useRouter().query.pot_id);
  if (!pot_id) return <Loading />;

  const { data, isLoading, error } = api.pots.getById.useQuery(
    { pot_id },
    { retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
  if (error) return <NotFound404 page="player" />;
  if (isLoading) return <Loading />;
  return (
    <SignedIn>
      <div className="h-screen bg-theme-black p-4 ">
        <div className="mb-2 grid grid-cols-7 rounded-lg bg-theme-grey p-4 text-white">
          <div className="col-span-5 flex flex-col ">
            <div className=" text-xs">Pot Name</div>
            <div className="text-xl font-bold">{data?.name}</div>
            <div className=" text-xs">Float</div>
            <div className="text-xl font-bold">{data?.float}</div>

            <IsBacker pot_id={pot_id}>
              <Modals pot_id={pot_id} />
            </IsBacker>
          </div>

          <div className="col-span-2">
            <SessionCount pot_id={pot_id} />
            <PotTotal pot_id={pot_id} />
          </div>
        </div>

        <div className="flex items-center justify-center"></div>

        {data?.sessions && <PotTable sessions={data.sessions} />}
      </div>
    </SignedIn>
  );
}
