import { useState } from "react";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

export default function Settings() {
  const { data, isLoading, isError } = api.users.getCurrentUserInfo.useQuery();
  const {
    mutate: updateUsername,
    isLoading: usernameLoading,
    isError: usernameError,
    isSuccess,
  } = api.users.updateUsername.useMutation();
  const ctx = api.useContext();
  if (isSuccess) void ctx.users.invalidate();
  const [username, setUsername] = useState("");

  if (isLoading) return <Loading />;
  if (usernameError) return <p>Error, please refresh</p>;

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleUsernameSubmit = () => {
    updateUsername({ username });
  };

  return (
    <div className="mx-auto mt-10 flex w-1/3 flex-col items-center justify-center space-y-4 rounded-lg bg-white p-10 shadow-lg">
      <h2>Settings</h2>
      <input
        className=" border-2 border-black text-right"
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter Username"
      />
      <span>Update Username</span>
      <button
        className="m-2 border-2 border-black p-2"
        disabled={usernameLoading || isError}
        onClick={handleUsernameSubmit}
      >
        Submit
      </button>
      <IsBackerSettingCheckBox isBackerProp={data?.is_backer ?? false} />
    </div>
  );
}

export function IsBackerSettingCheckBox({
  isBackerProp,
}: {
  isBackerProp: boolean;
}) {
  const {
    mutate: updateIsBacker,
    isLoading: isBackerLoading,
    isError: isBackerError,
    isSuccess,
  } = api.users.updateIsBacker.useMutation();
  const ctx = api.useContext();
  if (isSuccess) void ctx.users.invalidate();
  const [isBacker, setIsBacker] = useState(isBackerProp);
  const handleIsBackerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsBacker(event.target.checked);
  };

  const handleIsBackerSubmit = () => {
    updateIsBacker({ isBacker });
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-10 ">
      <input
        type="checkbox"
        className="h-10 w-10"
        checked={isBacker}
        onChange={handleIsBackerChange}
      />
      <span>I am a backer? Tick and submit</span>
      <button
        className="m-2 border-2 border-black p-2"
        disabled={isBackerLoading}
        onClick={handleIsBackerSubmit}
      >
        Submit
      </button>
      {isBackerError && <p className="text-red-500">Error, please try again</p>}
    </div>
  );
}
