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
      <li>
        <div>{friend.username} </div>
        <div>{formatShortDate(created_at)}</div>
        {!status && <div>pending</div>}
      </li>
    );
  return (
    <li>
      <div>{friend.username} </div>
      <div>{formatShortDate(created_at)}</div>
      {!status && <FriendRequestButton user_id={user_id} />}
    </li>
  );
}
function FriendRequestButton({ user_id }: { user_id: string }) {
  const { mutate, isLoading } = api.friends.accept.useMutation();
  return (
    <button disabled={isLoading} onClick={() => mutate({ sender: user_id })}>
      Accept?
    </button>
  );
}
