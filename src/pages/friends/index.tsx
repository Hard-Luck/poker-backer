import { useUser } from "@clerk/clerk-react";
import FriendsList from "~/components/friends/FriendsList";
import { api } from "~/utils/api";

export default function FriendsPage() {
  const { isLoaded } = useUser();
  const { data, isLoading } = api.users.getCurrentUserName.useQuery();
  if (!isLoaded || !data || isLoading) return <p>Loading...</p>;
  return <FriendsList username={data} />;
}
