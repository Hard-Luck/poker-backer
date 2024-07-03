import { getUserAuth } from '@/lib/auth/utils';
import Link from 'next/link';
import Navbar from './Navbar';
import type { FC, PropsWithChildren } from 'react';

const Header: FC<PropsWithChildren> =  () => {
  const { session } =  getUserAuth();

  return (
    <header className="px-4 w-full">
      <nav className="ml-auto flex gap-4 sm:gap-6 justify-between w-full">
        {session ? (
          <Navbar />
        ) : (
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/sign-in"
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
