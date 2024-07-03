import CreateBackingWizard from './CreateBackingWizard';
import { getUserAuth } from '@/lib/auth/utils';
import { getBackingsForUser } from '@/models/userBacking';
import BackingsList from './BackingsList';

export default async function Page() {
  const { session } = await getUserAuth();
  if (!session) return null;
  const backings = await getBackingsForUser(session.user.id);
  const whereUserIsPlayer = backings.filter(
    backing => backing.type === 'PLAYER'
  );
  const whereUserIsBacker = backings.filter(
    backing => backing.type === 'BACKER'
  );
  if (whereUserIsBacker.length === 0 && whereUserIsPlayer.length === 0) {
    return (
      <main>
        <h1 className="font-bold text-2xl">Histories</h1>
        <p>No floatsfound</p>
      </main>
    );
  }
  return (
    <main>
      <h1 className="font-bold text-2xl text-center">Backings</h1>
      {whereUserIsPlayer.length === 0 && whereUserIsBacker.length === 0 && (
        <p>No floats found</p>
      )}
      {whereUserIsBacker.length > 0 && (
        <BackingsList type="BACKER" backings={whereUserIsBacker} />
      )}
      {whereUserIsPlayer.length > 0 && (
        <BackingsList type="PLAYER" backings={whereUserIsPlayer} />
      )}

      <CreateBackingWizard />
    </main>
  );
}
