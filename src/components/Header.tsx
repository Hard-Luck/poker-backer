import Link from "next/link";
import Navbar from "./Navbar";
import type { FC, PropsWithChildren } from "react";

const Header: FC<PropsWithChildren> = () => {
  return (
    <header className="flex flex-col w-full items-center h-16">
      <Navbar />
      <Link
        className="text-sm font-medium hover:underline underline-offset-4"
        href="/sign-in"
      ></Link>
    </header>
  );
};

export default Header;
