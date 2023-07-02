import { SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Loading from "~/components/Loading";
import IsBacker from "~/components/confirm-button/IsBacker";
import { Modals } from "~/components/individual-horse/Modals";
import { PotTable } from "~/components/individual-horse/PotTable";

export default function Pot() {
  const pot_id = Number(useRouter().query.pot_id);
  if (!pot_id) return <Loading />;
  return (
    <SignedIn>
      <div className="flex flex-col gap-4  border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ">
        <IsBacker pot_id={pot_id}>
          <Modals pot_id={pot_id} />
        </IsBacker>
        <PotTable pot_id={pot_id} />
      </div>
    </SignedIn>
  );
}
