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
      <h2 className="">Pending Requests</h2>
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
      <li className=" flex border-2 border-black p-1 ">
        <div className="mr-2">{friend.username} </div>
        <div className="mr-2">{formatShortDate(created_at)}</div>
        {!status && <div>pending</div>}
      </li>
    );
  return (
    <li className="flex border-2 border-black p-1">
      <div className="">{user.username}</div>
      <div className="">{formatShortDate(created_at)}</div>
      {!status && <FriendRequestButton user_id={user_id} />}
    </li>
  );
}
function FriendRequestButton({ user_id }: { user_id: string }) {
  const { mutate, isLoading, isSuccess } = api.friends.accept.useMutation();
  const ctx = api.useContext();
  if (isSuccess) {
    void ctx.friends.invalidate();
  }
  return (
    <button
      className="border-2 border-black p-1"
      disabled={isLoading}
      onClick={() => mutate({ sender: user_id })}
    >
      Accept?
    </button>
  );
}
