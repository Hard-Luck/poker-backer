import { UserButton, useUser } from "@clerk/nextjs";
import * as React from "react";
import { useRouter } from "next/router";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const user = useUser();
  const router = useRouter();
  const currentPage = router.pathname.split("/")[1] ?? "";

  if (!user.isSignedIn) return null;

  const pages = ["home", "settings", "sessions", "friends"]; // I removed stats because I'm not sure about what I want on the page yet

  return (
    <div className="flex h-16 flex-col">
      <div className="flex h-full items-center justify-between bg-theme-white p-0 text-theme-black">
        <span className="my-3 pl-4">
          {user.isSignedIn && user.isLoaded && (
            <UserButton afterSignOutUrl="/" />
          )}
        </span>
        <Link className="my-3 text-2xl font-bold" href="/home">
          <Image
            src="/poker-backer-high-resolution-logo-black-on-transparent-background.png"
            alt="logo"
            width={200}
            height={200}
          />
        </Link>
        <BurgerMenu pages={pages} currentPage={currentPage} />
      </div>
    </div>
  );
}
