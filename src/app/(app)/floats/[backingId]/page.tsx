import { getUserAuth } from "@/lib/auth/utils";
import { findBackingWithSessionsChopsAndTopUps } from "@/models/userBacking";
import { notFound, redirect } from "next/navigation";
import BackingHero from "./BackingHero";
import HistoryList from "./SessionsList";
import BackingActionsBar from "./BackingActionsBar";

type BackingPageProps = {
  params: {
    backingId: string;
  };
};

export default async function page({ params }: BackingPageProps) {
  const { backingId } = params;
  const { session } = getUserAuth();
  if (!session) {
    redirect("/sign-in");
  }
  const backingDetails = await findBackingWithSessionsChopsAndTopUps({
    backingId: +backingId,
    userId: session.user.id,
  });
  if (backingDetails === null) {
    notFound();
  }
  const chops = backingDetails.backing.chops;
  const topUps = backingDetails.backing.topUps;
  const sessions = backingDetails.backing.session;
  const numberOfSessions = backingDetails.backing._count.session;
  const lastChopDate = chops.at(-1)?.created_at;

  const sessionsSinceLastChop = sessions.filter(s => {
    if (!lastChopDate) return true;
    return new Date(s.created_at) > new Date(lastChopDate);
  });

  const profitOrLoss = sessionsSinceLastChop.reduce(
    (acc, s) => acc + s.amount,
    0
  );
  const numberOfSessionsSinceLastChop = sessionsSinceLastChop.length;

  const currentFloat = backingDetails.backing.float + profitOrLoss;

  return (
    <main className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-none">
        <h1 className="text-3xl font-bold text-center p-2">
          History for {backingDetails.backing.name}
        </h1>
        <BackingHero
          totalSessions={numberOfSessions}
          profitOrLoss={profitOrLoss}
          currentFloat={currentFloat}
          float={backingDetails.backing.float}
          sessionsSinceLastChop={numberOfSessionsSinceLastChop}
        />
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <BackingActionsBar profitOrLoss={profitOrLoss} />
        <div className="flex-1 min-h-0">
          <HistoryList chops={chops} topUps={topUps} sessions={sessions} />
        </div>
      </div>
    </main>
  );
}
