import { useRouter } from "next/router";

export default function FriendsButton() {
  const router = useRouter();
  return (
    <div className="m-2 flex h-48 w-48 justify-center rounded-lg border-2 border-black">
      <button onClick={() => void router.push("/friends")}>Friends</button>
    </div>
  );
}
