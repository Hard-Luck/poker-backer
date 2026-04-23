import { getUserAuth } from "@/lib/auth/utils";
import { getBackingStatsForPage } from "@/models/userBacking";
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
  const stats = await getBackingStatsForPage({
    backingId: parsedBackingId,
    userId: session.user.id,
  });
  if (stats === null) {
    notFound();
  }

  const currentFloat = stats.float + stats.profitOrLoss;

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
                {stats.name}
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
          totalSessions={stats.totalSessions}
          profitOrLoss={stats.profitOrLoss}
          currentFloat={currentFloat}
          float={stats.float}
          sessionsSinceLastChop={stats.sessionsSinceLastChop}
        />
      </div>

      {/* Actions Bar */}
      <div className="flex-none">
        <BackingActionsBar profitOrLoss={stats.profitOrLoss} />
      </div>

      {/* History List — fetches its own data client-side to avoid RSC timeout */}
      <div className="flex-1 min-h-0">
        <HistoryList backingId={parsedBackingId} />
      </div>
    </main>
  );
}
