import { useState } from "react";
import { api } from "~/utils/api";
import ConfirmButton from "../confirm-button/ConfirmButton";

export default function AddFriend() {
  const [search, setSearch] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [searched, setSearched] = useState<boolean>(false);

  const { data } = api.users.getUserByUsername.useQuery({
    username,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = e.currentTarget.value;
    setSearch(searchTerm);
  }

  function handleClick() {
    if (search.length > 2) {
      setUsername(search);
      setSearched(true);
    }
  }

  return (
    <div className="flex min-h-min flex-col items-center justify-center bg-gray-200 p-1">
      <div className="w-full max-w-md">
        <input
          type="text"
          value={search}
          onChange={handleChange}
          placeholder="Search for friends"
          className="mb-4 w-full rounded border border-gray-300 px-4 py-2"
        />
        <button
          onClick={handleClick}
          className="mb-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>
        {data &&
          data.map((person) => {
            return (
              <div
                key={person.id}
                className="mb-2 flex items-center justify-between rounded bg-white p-1 shadow"
              >
                <p className="text-lg font-semibold">{person.username}</p>
                <AddFriendButton friend_id={person.id} />
              </div>
            );
          })}
        {searched && data?.length === 0 && (
          <p className="text-red-500">No results</p>
        )}
      </div>
    </div>
  );
}

export function AddFriendButton({ friend_id }: { friend_id: string }) {
  const { data: status, isLoading } = api.friends.getFriendStatus.useQuery({
    friend_id,
  });
  const ctx = api.useContext();
  const {
    mutate,
    isLoading: disabled,
    data,
    isSuccess,
  } = api.friends.create.useMutation();
  if (isSuccess) {
    void ctx.friends.invalidate();
  }
  if (isLoading) return null;
  if (data) return <p>{data.status ? "Friend" : "Pending"}</p>;
  if (status === true) return <p>Friend</p>;
  if (status === false) return <p>Pending</p>;
  if (status === null)
    return (
      <ConfirmButton
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        disabled={disabled}
        onConfirm={() => mutate({ friend_id })}
        buttonLabel="AddFriend"
        confirmMessage="Send Friend Request"
      />
    );
  return null;
}
