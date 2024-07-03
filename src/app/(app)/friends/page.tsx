import { getUserAuth } from '@/lib/auth/utils';
import { getAllFriends, getFriendRequests } from '@/models/friends';
import { redirect } from 'next/navigation';
import FriendRequestWizard from './FriendRequestWizard';
import FriendsList from './FriendsList';
import FriendRequestList from './FriendRequestLists';

export default async function FriendsPage() {
  const { session } = await getUserAuth();
  if (!session) redirect('/sign-in');
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
    <main className="max-w-[500px]">
      <h2 className="text-xl font-semibold">Friends</h2>
      <FriendRequestWizard />
      <FriendsList friends={confirmedFriends} />
      <FriendRequestList
        friendRequests={pendingReceivedRequests}
        sentFriendRequests={pendingSentRequests}
      />
    </main>
  );
}
