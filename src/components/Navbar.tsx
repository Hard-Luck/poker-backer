import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function NavBar() {
  const user = useUser();
  if (!user.isSignedIn) return null;
  const pages = ["home", "pots", "session", "friends"];
  return (
    <div>
      {pages.map((page) => {
        return (
          <Link href={`/${page}`} key={page}>
            <button className="m-2 rounded-md bg-gray-200 p-2">{page}</button>
          </Link>
        );
      })}
    </div>
  );
}
