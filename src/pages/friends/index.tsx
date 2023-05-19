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
    <div>
      <FriendsList username={data} />
      <AddFriend />
    </div>
  );
}
