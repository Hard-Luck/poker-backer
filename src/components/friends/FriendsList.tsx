import type { FriendRequest } from "types/api";
import { api } from "~/utils/api";
import { formatShortDate } from "~/utils/timestamp";
import Loading from "../Loading";
import { BsCheck } from "react-icons/bs";
import { RiPassPendingFill } from "react-icons/ri";

export default function FriendsList({ username }: { username: string }) {
  const { data, isLoading } = api.friends.getUserFriendsWithStatus.useQuery();
  if (isLoading) return <Loading />;
  if (!data) return <div>No friends yet</div>;
  const pendingRequests = data.filter((request) => {
    return !request.status;
  });
  const friends = data.filter((request) => !!request.status);

  return (
    <div className="h-[calc(100vh-4rem)]">
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

      <h3 className="text-l p-2 pl-4 font-semibold">Pending Requests</h3>
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
          <div className="flex items-center rounded-lg bg-[#FFBF8A] pl-2 pr-2 text-xl text-white">
            <RiPassPendingFill />
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
      className="flex items-center rounded-lg bg-theme-green pl-2 pr-2 text-xl text-white"
      disabled={isLoading}
      onClick={() => mutate({ sender: user_id })}
    >
      <BsCheck />
    </button>
  );
}
