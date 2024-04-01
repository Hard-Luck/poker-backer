import { getUserAuth } from "@/lib/auth/utils";
import { findBackingWithSessionsChopsAndTopUps } from "@/models/userBacking";
import { notFound, redirect } from "next/navigation";
import BackingHero from "./BackingHero";
import HistoryList from "./SessionsList";
import BackingActionsBar from "./BackingActionsBar";
import AddSessionSidePanel from "./AddSessionSidePanel";

type BackingPageProps = {
  params: {
    backingId: string;
  };
};

export default async function page({ params }: BackingPageProps) {
  const { backingId } = params;
  const { session } = await getUserAuth();
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
  console.log(lastChopDate);

  const sessionsSinceLastChop = sessions.filter((s) => {
    if (!lastChopDate) return true;
    return new Date(s.created_at) > new Date(lastChopDate);
  });
  const topUpsSinceLastChop = topUps.filter((t) => {
    if (!lastChopDate) return true;
    //compare the date of the topup with the date of the last chop as dates
    //are stored as strings in the database
    return new Date(t.created_at) > new Date(lastChopDate);
  });

  const totalTopUps = topUpsSinceLastChop.reduce((acc, t) => acc + t.amount, 0);
  const profitOrLoss = sessionsSinceLastChop.reduce(
    (acc, s) => acc + s.amount,
    0
  );
  const numberOfSessionsSinceLastChop = sessionsSinceLastChop.length;

  const currentFloat = backingDetails.backing.float + profitOrLoss;

  return (
    <main>
      <h1 className="text-3xl font-bold text-center">
        History for {backingDetails.backing.name}
      </h1>
      <BackingHero
        totalSessions={numberOfSessions}
        profitOrLoss={profitOrLoss}
        currentFloat={currentFloat}
        float={backingDetails.backing.float}
        currentTopUps={totalTopUps}
        sessionsSinceLastChop={numberOfSessionsSinceLastChop}
      />
      <AddSessionSidePanel />

      <BackingActionsBar profitOrLoss={profitOrLoss} />
      <HistoryList chops={chops} topUps={topUps} sessions={sessions} />
    </main>
  );
}
