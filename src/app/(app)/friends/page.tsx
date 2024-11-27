import { getUserAuth } from "@/lib/auth/utils";
import { getAllFriends } from "@/models/friends";
import { redirect } from "next/navigation";

import FriendsRequests from "./FriendRequests";

export default async function FriendsPage() {
  const { session } = getUserAuth();
  if (!session) redirect("/sign-in");
  const friends = await getAllFriends(session.user.id);

  const confirmedFriends = friends.filter(friend => friend.status === true);
  const currentPendingRequests = friends.filter(
    friend => friend.status === false
  );
  const pendingSentRequests = currentPendingRequests.filter(
    request => request.userId === session.user.id
  );
  const pendingReceivedRequests = currentPendingRequests.filter(
    request => request.friend_id === session.user.id
  );

  return (
    <FriendsRequests
      friends={confirmedFriends}
      receivedRequests={pendingReceivedRequests}
      sentRequests={pendingSentRequests}
    />
  );
}
