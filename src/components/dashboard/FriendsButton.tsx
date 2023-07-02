import { useRouter } from "next/router";
import { FaUserFriends } from "react-icons/fa";

export default function FriendsButton() {
  const router = useRouter();
  return (
    <div className="m-2 flex h-24 w-48 justify-center rounded-lg  bg-theme-grey text-white">
      <button
        className="text-6xl text-white"
        onClick={() => void router.push("/friends")}
      >
        <FaUserFriends />
        <div className="text-xl">Friends</div>
      </button>
    </div>
  );
}
