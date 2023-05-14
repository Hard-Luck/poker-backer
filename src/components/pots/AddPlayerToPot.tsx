import { useState } from "react";
import { api } from "~/utils/api";

export default function AddPlayerToPot({ pot_id }: { pot_id: number }) {
  const { data, isLoading } = api.friends.getUserAcceptedFriends.useQuery();
  if (isLoading) return <p>Loading...</p>;
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
  const { mutate, isError } = api.potAccess.create.useMutation();
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsBacker(event.target.checked ? 1 : 0);
  };
  return (
    <div>
      <button onClick={() => mutate({ user_id, pot_id, type: isBacker })}>
        Add to pot
      </button>
      <label>
        Is Backer:
        <input
          type="checkbox"
          checked={!!isBacker}
          onChange={handleCheckboxChange}
        />
      </label>
      {isError && <p>Error</p>}
    </div>
  );
}
