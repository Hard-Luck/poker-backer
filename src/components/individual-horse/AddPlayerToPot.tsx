import { useState } from "react";
import { api } from "~/utils/api";
import Loading from "../Loading";
import ConfirmButton from "../confirm-button/ConfirmButton";
import { FiUserPlus } from "react-icons/fi";

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
      className="fixed inset-0 flex items-center justify-center bg-theme-black bg-opacity-90 text-center"
      onClick={onClose}
    >
      <div
        className="rounded-lg bg-theme-black p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <label htmlFor="search-add-pot">Add a friend</label>
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
            <div
              className="m-2 flex justify-between rounded-lg bg-theme-grey p-2"
              key={user.id}
            >
              <p className="p-2 text-lg font-bold">{user.username}</p>
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
  const { mutate, data, isError, isSuccess, isLoading } =
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
    <div className="flex items-center">
      <div className="flex flex-col">
        <label className="text-sm font-bold">As Backer?:</label>
        <input
          type="checkbox"
          checked={!!isBacker}
          onChange={handleCheckboxChange}
        />
      </div>
      <ConfirmButton
        className="ml-2 rounded-md bg-blue-500 p-2 text-xl"
        onConfirm={handleClick}
        disabled={isLoading}
        buttonLabel={<FiUserPlus />}
        // confirmMessage="Confirm?"
      />
      {!!data && <p className="text-green-500">Player Added</p>}
      {isError && <p className="text-red-500">Error</p>}
    </div>
  );
}
