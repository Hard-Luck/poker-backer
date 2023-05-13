import { UserButton, useUser } from "@clerk/nextjs";

import * as React from "react";

export function Header() {
  const user = useUser();

  return (
    <>
      <div className="h-full bg-black text-white">Poker Backer</div>

      {user.isSignedIn && user.isLoaded && <UserButton afterSignOutUrl="/" />}
    </>
  );
}
