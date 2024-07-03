import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-theme-black">
      <Image
        src="/logo-white.png"
        alt="logo"
        width={400}
        height={400}
        className="rounded-3xl"
        priority
      />
      <SignIn redirectUrl={'/dashboard'} />
    </main>
  );
}
