import type { FriendRequest } from "types/api";
import { api } from "~/utils/api";
import { formatShortDate } from "~/utils/timestamp";
import Loading from "../Loading";

export default function FriendsList({ username }: { username: string }) {
  const { data, isLoading } = api.friends.getUserFriendsWithStatus.useQuery();
  if (isLoading) return <Loading />;
  if (!data) return <div>No friends yet</div>;
  const pendingRequests = data.filter((request) => {
    return !request.status;
  });
  const friends = data.filter((request) => !!request.status);
  return (
    <div>
      <h2 className="mb-2 text-center text-xl font-semibold">
        Pending Requests
      </h2>
      <ul>
        {pendingRequests.map((friendInfo) => {
          return (
            <FriendCard
              username={username}
              key={friendInfo.id}
              friendRequest={friendInfo}
            />
          );
        })}
      </ul>
      <h2 className="mb-2 text-center text-xl font-semibold">Friends</h2>
      <ul>
        {friends.map((friendInfo) => {
          return (
            <FriendCard
              username={username}
              key={friendInfo.id}
              friendRequest={friendInfo}
            />
          );
        })}
      </ul>
    </div>
  );
}

function FriendCard({
  friendRequest,
  username,
}: {
  friendRequest: FriendRequest;
  username: string;
}) {
  const { user_id, status, created_at, friend, user } = friendRequest;
  if (user.username === username)
    return (
      <li className=" justify- mb-2 flex items-center rounded-md border border-gray-300 bg-gray-50 p-2">
        <div className="mr-2">{friend.username} </div>
        <div className="mr-2">{formatShortDate(created_at)}</div>
        {!status && <div>pending</div>}
      </li>
    );
  return (
    <li className="mb-4 flex items-center justify-between rounded bg-white p-4 shadow">
      <div className="text-lg font-semibold">{user.username}</div>
      <div className="text-gray-600">{formatShortDate(created_at)}</div>
      {!status && <FriendRequestButton user_id={user_id} />}
    </li>
  );
}
function FriendRequestButton({ user_id }: { user_id: string }) {
  const { mutate, isLoading } = api.friends.accept.useMutation();
  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      disabled={isLoading}
      onClick={() => mutate({ sender: user_id })}
    >
      Accept?
    </button>
  );
}
