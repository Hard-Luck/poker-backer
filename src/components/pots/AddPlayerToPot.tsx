import { useState } from "react";
import { api } from "~/utils/api";
import Loading from "../Loading";

export default function AddPlayerToPot({ pot_id }: { pot_id: number }) {
  const { data, isLoading } = api.friends.getUserAcceptedFriends.useQuery();
  if (isLoading) return <Loading />;
  if (!data) return <p>No friends</p>;

  return (
    <div>
      {data.map((user) => {
        return (
          <div key={user.id}>
            <p>{user.username}</p>
            <AddToPotButton user_id={user.id} pot_id={pot_id} />
          </div>
        );
      })}
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
