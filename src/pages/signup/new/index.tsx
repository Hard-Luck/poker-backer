import { SignedIn, useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

export default function NewSignUpPage() {
  return (
    <SignedIn>
      <NewUserCheck />;
    </SignedIn>
  );
}

export function NewUserCheck() {
  const user = useUser();
  const router = useRouter();
  const { data, isLoading } = api.users.getCurrentUserInfo.useQuery();
  if (!user || isLoading || !router) return null;
  if (data) void router.push("/home");
  const user_id = user.user?.id;
  const name = user.user?.fullName || "";
  if (!user_id) return null;

  const props = { user_id, name };
  return <NewUser {...props} />;
}

export function NewUser({ name }: { name: string }) {
  const [username, setUsername] = useState(name);
  const [isBacker, setIsBacker] = useState(false);
  const router = useRouter();
  const { mutate, isError, data } = api.users.create.useMutation();
  if (!!data) void router.push("/home");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsBacker(event.target.checked);
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    mutate({ username, isBacker });
  };

  return (
    <div>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          maxLength={30}
        />
      </label>
      <label>
        Are you backing?
        <input
          type="checkbox"
          checked={isBacker}
          onChange={handleCheckboxChange}
        />
      </label>
      <button onClick={handleSubmit}>Submit</button>
      {isError && <p>Error try again or refresh</p>}
    </div>
  );
}
