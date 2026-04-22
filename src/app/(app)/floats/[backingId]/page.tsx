import { getUserAuth } from "@/lib/auth/utils";
import { findBackingWithSessionsChopsAndTopUps } from "@/models/userBacking";
import { parsePositiveInt } from "@/models/utils/parse";
import { notFound, redirect } from "next/navigation";
import BackingHero from "./BackingHero";
import HistoryList from "./SessionsList";
import BackingActionsBar from "./BackingActionsBar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BackingPageProps = {
  params: {
    backingId: string;
  };
};

export default async function page({ params }: BackingPageProps) {
  const { backingId } = params;
  const parsedBackingId = parsePositiveInt(backingId);
  const { session } = getUserAuth();
  if (!session) {
    redirect("/sign-in");
  }
  if (!parsedBackingId) {
    notFound();
  }
  const backingDetails = await findBackingWithSessionsChopsAndTopUps({
    backingId: parsedBackingId,
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
      {/* Header */}
      <div className="flex-none border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/floats" 
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                {backingDetails.backing.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Float History & Management
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Hero */}
      <div className="flex-none">
        <BackingHero
          totalSessions={numberOfSessions}
          profitOrLoss={profitOrLoss}
          currentFloat={currentFloat}
          float={backingDetails.backing.float}
          sessionsSinceLastChop={numberOfSessionsSinceLastChop}
        />
      </div>
      
      {/* Actions Bar */}
      <div className="flex-none">
        <BackingActionsBar profitOrLoss={profitOrLoss} />
      </div>
      
      {/* History List */}
      <div className="flex-1 min-h-0">
        <HistoryList chops={chops} topUps={topUps} sessions={sessions} />
      </div>
    </main>
  );
}
