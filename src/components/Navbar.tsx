import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function NavBar() {
  const user = useUser();
  if (!user.isSignedIn) return null;
  const pages = ["home", "pots", "session", "friends"];
  return (
    <div>
      <div className="fixed bottom-0 flex w-full flex-row justify-center bg-slate-800 ">
        {pages.map((page) => (
          <Link
            className="m-2 flex rounded-md bg-gray-200 p-2"
            href={`/${page}`}
            key={page}
          >
            <button className="m-2 flex rounded-md bg-gray-200">{page}</button>
          </Link>
        ))}
      </div>
      <div className="pb-16">{/* Content here */}</div>
    </div>
  );
}
