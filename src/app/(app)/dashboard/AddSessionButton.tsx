import Link from "next/link";
import React from "react";
import { buttonVariants } from "../../../components/ui/button";
export default function AddSessionButton() {
  return (
    <Link
      href="/session/new"
      passHref
      className={buttonVariants({
        variant: "outline",
        className:
          "bg-white text-gray-900 border-gray-300 hover:bg-gray-50 max-w-32 self-center mt-4",
      })}>
      Add Session
    </Link>
  );
}
