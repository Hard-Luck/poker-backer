import Link from "next/link";
import Navbar from "./Navbar";
import type { FC, PropsWithChildren } from "react";

const Header: FC<PropsWithChildren> = () => {
  return (
    <header className="px-4 w-full">
      <nav className="ml-auto flex gap-4 sm:gap-6 justify-between w-full">
        <Navbar />

        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/sign-in"
        ></Link>
      </nav>
    </header>
  );
};

export default Header;
