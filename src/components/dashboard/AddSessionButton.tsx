import { useRouter } from "next/router";
import React from "react";

export default function AddSessionButton() {
  const router = useRouter();
  function handleClick() {
    void router.push("/sessions");
  }
  return (
    <button
      className="w-75 mt-5 rounded-lg bg-theme-header px-4 py-2 text-white hover:bg-blue-700"
      onClick={handleClick}
    >
      Add Session
    </button>
  );
}
