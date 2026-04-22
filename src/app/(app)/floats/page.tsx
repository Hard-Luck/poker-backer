import CreateBackingWizard from "./CreateBackingWizard";
import { getUserAuth } from "@/lib/auth/utils";
import { getBackingsForUser } from "@/models/userBacking";
import BackingTabs from "./BackingsTabs";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default async function Page() {
  const { session } = getUserAuth();
  if (!session) return null;

  const backings = await getBackingsForUser(session.user.id);
  const whereUserIsPlayer = backings.filter(
    backing => backing.type === "PLAYER"
  );
  const whereUserIsBacker = backings.filter(
    backing => backing.type === "BACKER"
  );

  const hasBackings = whereUserIsBacker.length > 0 || whereUserIsPlayer.length > 0;

  return (
    <main className="container max-w-4xl mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Floats</h1>
            <p className="text-sm text-muted-foreground">Manage your backing arrangements</p>
          </div>
        </div>
        <CreateBackingWizard />
      </div>

      {/* Content */}
      {!hasBackings ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 rounded-full bg-muted mb-4">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No floats yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Create your first float to start tracking backing arrangements with players.
            </p>
          </CardContent>
        </Card>
      ) : (
        <BackingTabs backers={whereUserIsBacker} players={whereUserIsPlayer} />
      )}
    </main>
  );
}
