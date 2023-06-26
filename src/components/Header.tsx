import Link from "next/link";
import { slide as Menu } from "react-burger-menu";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import * as React from "react";
import { SignedIn } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import BurgerMenu from "./BurgerMenu";

export default function Header() {
  const user = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const currentPage = router.pathname.split("/")[1];
  const closeMenu = () => setIsOpen(false);
  const handleStateChange = () => setIsOpen(!isOpen);

  if (!user.isSignedIn) return null;

  const pages = ["home", "settings", "sessions", "stats", "friends"];

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
        <BurgerMenu pages={pages} />
      </div>
    </div>
  );
}
