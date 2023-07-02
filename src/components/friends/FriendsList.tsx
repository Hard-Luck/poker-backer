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
    <div className="">
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

      <div>
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
      <li className="m-4 flex justify-between rounded-lg bg-theme-grey p-2">
        <div className="flex">
          <div className="pl-2 pr-2 font-semibold">{friend.username} </div>
          <div className="pl-2 pr-2">{formatShortDate(created_at)}</div>
        </div>
        {!status && (
          <div className="flex items-center rounded-lg bg-theme-white pl-2 pr-2 text-xs text-theme-black">
            PENDING
          </div>
        )}
      </li>
    );
  return (
    <li className=" m-4 flex  justify-between rounded-lg bg-theme-grey p-2 ">
      <div className="flex">
        <div className="pl-2 pr-2 font-semibold">{user.username}</div>
        <div className="pl-2 pr-2">{formatShortDate(created_at)}</div>
      </div>
      {!status && <FriendRequestButton user_id={user_id} />}
    </li>
  );
}

function FriendRequestButton({ user_id }: { user_id: string }) {
  const ctx = api.useContext();
  const { mutate, isLoading, isSuccess } = api.friends.accept.useMutation();
  if (isSuccess) {
    void ctx.friends.invalidate();
  }
  return (
    <button
      className="flex items-center rounded-lg bg-theme-white pl-2 pr-2 text-xs text-theme-black"
      disabled={isLoading}
      onClick={() => mutate({ sender: user_id })}
    >
      Accept?
    </button>
  );
}
