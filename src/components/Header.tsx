import { UserButton, useUser } from "@clerk/nextjs";

import * as React from "react";

export function Header() {
  const user = useUser();

  return (
    <div className="flex h-full items-center bg-black p-0 text-white">
      <h1 className="my-3 flex-1 text-center text-2xl font-bold">
        Poker Backer
      </h1>
      <span className="my-3 self-end pr-4">
        {user.isSignedIn && user.isLoaded && <UserButton afterSignOutUrl="/" />}
      </span>
    </div>
  );
}
