import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import * as React from "react";

export interface IHeaderProps {}

export function Header(props: IHeaderProps) {
  const user = useUser();
  const router = useRouter();

  return (
    <>
      <div className="h-full bg-black text-white">Poker Backer</div>

      {user.isSignedIn && user.isLoaded && (
        <SignOutButton signOutCallback={() => router.push("/")} />
      )}
    </>
  );
}
