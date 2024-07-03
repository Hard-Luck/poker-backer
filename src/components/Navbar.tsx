'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlignRight } from 'lucide-react';
import { defaultLinks } from '@/config/nav';
import ThemeToggle from './ThemeToggle';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className=" border-b mb-4 py-2 w-full text-right">
      <nav className="flex justify-between  items-center">
        <UserButton />
        <Link href="/dashboard">
          <HeaderLogo />
        </Link>
        <div className="flex align-middle justify-center">
          <Button variant="link" role="button" onClick={() => setOpen(!open)}>
            <AlignRight />
          </Button>
        </div>
      </nav>
      {open ? (
        <div className="my-4 p-4 bg-muted">
          <ul className="space-y-2">
            {defaultLinks.map(link => (
              <li key={link.title} onClick={() => setOpen(false)} className="">
                <Link
                  href={link.href}
                  className={
                    pathname === link.href
                      ? 'text-primary hover:text-primary font-semibold'
                      : 'text-muted-foreground hover:text-primary'
                  }
                >
                  {link.title}
                </Link>
              </li>
            ))}
            <li>
              <span>Theme: </span>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

const HeaderLogo = () => {
  const { theme } = useTheme();
  if (!theme)
    return (
      <Image src="/header-logo-white.png" width={100} height={100} alt="logo" />
    );
  return theme === 'dark' ? (
    <Image src="/header-logo-white.png" width={100} height={100} alt="logo" />
  ) : (
    <Image src="/header-logo-black.png" width={100} height={100} alt="logo" />
  );
};
