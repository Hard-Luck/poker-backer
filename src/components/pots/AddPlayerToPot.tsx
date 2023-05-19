import { useState } from "react";
import { api } from "~/utils/api";
import Loading from "../Loading";

export default function AddPlayerToPot({
  pot_id,
  onClose,
}: {
  pot_id: number;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const { data, isLoading } = api.friends.getUserAcceptedFriends.useQuery();
  if (isLoading) return <Loading />;
  if (!data) return <p>No friends</p>;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
        {data
          .filter((friend) =>
            friend.username.toLowerCase().includes(search.toLowerCase())
          )
          .map((user) => {
            return (
              <div key={user.id}>
                <p>{user.username}</p>
                <AddToPotButton user_id={user.id} pot_id={pot_id} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
export function AddToPotButton({
  user_id,
  pot_id,
}: {
  user_id: string;
  pot_id: number;
}) {
  const [isBacker, setIsBacker] = useState(0);
  const { mutate, data, isError } = api.potAccess.create.useMutation();
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsBacker(event.target.checked ? 1 : 0);
  };
  const handleClick = () => {
    mutate({ user_id, pot_id, type: isBacker });
  };
  return (
    <div>
      <button className="rounded-md bg-blue-500 p-2" onClick={handleClick}>
        Add to pot
      </button>
      <label>
        As Backer?:
        <input
          type="checkbox"
          checked={!!isBacker}
          onChange={handleCheckboxChange}
        />
      </label>
      {!!data && <p className="text-green-500">Player Added</p>}
      {isError && <p className="text-red-500">Error</p>}
    </div>
  );
}
