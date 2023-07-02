import { UserButton, useUser } from "@clerk/nextjs";
import * as React from "react";
import { useRouter } from "next/router";
import BurgerMenu from "./BurgerMenu";

export default function Header() {
  const user = useUser();
  const router = useRouter();
  const currentPage = router.pathname.split("/")[1] ?? "";

  if (!user.isSignedIn) return null;

  const pages = ["home", "settings", "sessions", "stats", "friends"];

  return (
    <div className="flex h-16 flex-col">
      <div className="flex h-full items-center bg-black p-0 text-white">
        <span className="my-3 pl-4">
          {user.isSignedIn && user.isLoaded && (
            <UserButton afterSignOutUrl="/" />
          )}
        </span>
        <h1 className="my-3 flex-1 text-center text-2xl font-bold">
          Poker Backer
        </h1>
        <BurgerMenu pages={pages} currentPage={currentPage} />
      </div>
    </div>
  );
}
