import { SignedIn, useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

export default function NewSignUpPage() {
  return (
    <SignedIn>
      <NewUserCheck />
    </SignedIn>
  );
}

export function NewUserCheck() {
  const user = useUser();
  const router = useRouter();
  const user_id = user.user?.id;
  const name = user.user?.fullName || "";
  const { data, isLoading } = api.users.getCurrentUserInfo.useQuery();
  if (!user_id) return null;
  const props = { user_id, name };
  if (isLoading) return null;
  if (data) void router.push("/home");
  return <NewUser {...props} />;
}

export function NewUser({ name }: { name: string }) {
  const [username, setUsername] = useState(name);
  const [isBacker, setIsBacker] = useState(false);
  const router = useRouter();
  const { mutate, isError, isSuccess } = api.users.create.useMutation();
  if (isSuccess) void router.push("/home");

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
    <div className="flex flex-col items-center justify-center gap-4 text-xl">
      <label>
        Username:
        <input
          type="text"
          className="border-2 border-black"
          value={username}
          onChange={handleUsernameChange}
          maxLength={30}
        />
      </label>
      <label>
        Are you a backer?
        <input
          type="checkbox"
          checked={isBacker}
          className="border-2 border-black"
          onChange={handleCheckboxChange}
        />
      </label>
      <button
        className="rounded-md border-2 border-black bg-slate-700 p-2 text-white"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {isError && (
        <div className="flex flex-col items-center justify-center gap-4 text-xl">
          <p>
            Error try again or refresh, you may have already signed up try going
            to home click below
          </p>
          <button
            className="rounded-md border-2 border-black bg-slate-700 p-2 text-white"
            onClick={() => void router.push("/home")}
          >
            Go to home page
          </button>
        </div>
      )}
    </div>
  );
}
