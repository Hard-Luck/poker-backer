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
  //const [search, setSearch] = useState("");
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
        <label htmlFor="search-add-pot">Search for a friend</label>
        {/* <input
          id="search-add-pot"
          type="text"
          placeholder="Search for a friend"
          className="rounded-sm border-2 border-gray-700 p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}
        {data.map((user) => {
          return (
            <div key={user.id}>
              <p className="text-lg font-bold">{user.username}</p>
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
  const ctx = api.useContext();
  const { mutate, data, isError, isSuccess } =
    api.potAccess.create.useMutation();
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsBacker(event.target.checked ? 1 : 0);
  };
  const handleClick = () => {
    mutate({ user_id, pot_id, type: isBacker });
  };
  if (isSuccess) {
    void ctx.friends.invalidate();
  }
  return (
    <div className="flex flex-col items-center">
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
