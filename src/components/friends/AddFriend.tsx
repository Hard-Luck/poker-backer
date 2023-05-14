import { useState } from "react";
import { api } from "~/utils/api";

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
    <div>
      <input
        type="text"
        value={search}
        onChange={handleChange}
        placeholder="Search for friends"
      />
      <button onClick={handleClick}>Search</button>
      {data &&
        data.map((person) => {
          return (
            <div key={person.id}>
              <p>{person.username}</p>
              <AddFriendButton friend_id={person.id} />
            </div>
          );
        })}
      {searched && data?.length === 0 && <p>No results</p>}
    </div>
  );
}

export function AddFriendButton({ friend_id }: { friend_id: string }) {
  const { data, isLoading } = api.friends.getFriendStatus.useQuery({
    friend_id,
  });
  const { mutate, isLoading: disabled } = api.friends.create.useMutation();
  if (isLoading) return null;
  if (data === true) return <p>Friend</p>;
  if (data === false) return <p>Pending</p>;
  if (data === null)
    return (
      <button disabled={disabled} onClick={() => mutate({ friend_id })}>
        Add Friend
      </button>
    );
  return null;
}
