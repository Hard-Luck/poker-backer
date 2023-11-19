import { SignedIn } from '@clerk/nextjs';
import AddSession from '~/components/session/AddSession';

export default function Session() {
  return (
    <SignedIn>
      <AddSession />
    </SignedIn>
  );
}
