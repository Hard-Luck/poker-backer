import Link from "next/link";
import { slide as Menu } from "react-burger-menu";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import * as React from "react";
import { SignedIn } from "@clerk/clerk-react";
import { useRouter } from "next/router";

export default function Header() {
  const user = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const currentPage = router.pathname.split("/")[1];
  const closeMenu = () => setIsOpen(false);
  const handleStateChange = () => setIsOpen(!isOpen);

  if (!user.isSignedIn) return null;

  const pages = ["home", "settings", "sessions", "stats", "friends"];

  const HamburgerIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full items-center bg-black p-0 text-white">
        <span className="my-3 pl-4">
          {user.isSignedIn && user.isLoaded && (
            <UserButton afterSignOutUrl="/" />
          )}
        </span>
        <h1 className="my-3 flex-1 text-center text-2xl font-bold">
          Poker Backer
        </h1>
        <div onClick={handleStateChange} className="cursor-pointer p-8">
          {HamburgerIcon}
        </div>
      </div>
      <SignedIn>
        <Menu
          customBurgerIcon={false}
          right
          width={"20%"}
          isOpen={isOpen}
          onStateChange={({ isOpen }) => setIsOpen(isOpen)}
        >
          {pages.map((page) => {
            if (page === currentPage)
              return (
                <p className="menu-item pr-2 text-right underline" key={page}>
                  {page}
                </p>
              );
            return (
              <Link
                onClick={closeMenu}
                className="menu-item pr-2 text-right"
                href={`/${page}`}
                key={page}
              >
                {page}
              </Link>
            );
          })}
        </Menu>
      </SignedIn>
    </div>
  );
}
