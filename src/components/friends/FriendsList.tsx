import type { FriendRequest } from "types/api";
import { api } from "~/utils/api";
import { formatShortDate } from "~/utils/timestamp";

export default function FriendsList({ username }: { username: string }) {
  const { data, isLoading } = api.friends.getUserFriendsWithStatus.useQuery();
  if (isLoading) return <p>loading...</p>;
  return (
    <ul>
      {data &&
        data.map((friendInfo) => {
          return (
            <FriendCard
              username={username}
              key={friendInfo.id}
              friendRequest={friendInfo}
            />
          );
        })}
    </ul>
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
      <div className="text-lg font-semibold">{friend.username}</div>
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
