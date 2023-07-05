import { useUser } from "@clerk/clerk-react";
import Loading from "~/components/Loading";
import AddFriend from "~/components/friends/AddFriend";
import FriendsList from "~/components/friends/FriendsList";
import { api } from "~/utils/api";

export default function FriendsPage() {
  const { isLoaded } = useUser();
  const { data, isLoading } = api.users.getCurrentUserName.useQuery();
  if (!isLoaded || !data || isLoading) return <Loading />;
  return (
    <div className="relative h-[calc(100vh-4rem)] bg-theme-black text-theme-white">
      <h2 className="p-4 text-xl font-semibold">Friends</h2>
      <AddFriend />
      <FriendsList username={data} />
    </div>
  );
}
