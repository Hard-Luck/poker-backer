import CreateBackingWizard from "./CreateBackingWizard";
import { getUserAuth } from "@/lib/auth/utils";
import { getBackingsForUser } from "@/models/userBacking";
import BackingTabs from "./BackingsTabs";

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

  return (
    <main className="w-3/4 flex flex-col items-center">
      <h1 className="font-bold text-2xl text-center">Backings</h1>
      {whereUserIsBacker.length === 0 && whereUserIsPlayer.length === 0 ? (
        <p>No floats found</p>
      ) : (
        <BackingTabs backers={whereUserIsBacker} players={whereUserIsPlayer} />
      )}
      <CreateBackingWizard />
    </main>
  );
}
