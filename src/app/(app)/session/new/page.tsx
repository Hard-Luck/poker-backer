import { getUserAuth } from '@/lib/auth/utils';
import { getBackingsForUser } from '@/models/userBacking';
import AddSessionForm from './AddSessionForm';

export default async function Page() {
  const { session } = await getUserAuth();
  if (!session) throw new Error('No session found');

  const backingsUserCanAddTo = await getBackingsForUser(session.user.id);
  if (!backingsUserCanAddTo?.length) return <p>No Associated Pots</p>;
  return (
    <main>
      <AddSessionForm backings={backingsUserCanAddTo} />
    </main>
  );
}
