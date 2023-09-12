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
    <div className="mx-auto flex h-screen flex-col items-center bg-theme-black text-white">
      <h2 className="m-2 text-2xl">Settings</h2>

      <span>Update Username</span>
      <input
        className="m-2 rounded-lg p-4 text-theme-black"
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter Username"
      />
      <button
        className="m-4 rounded-lg bg-theme-header p-3"
        disabled={usernameLoading || isError}
        onClick={handleUsernameSubmit}
      >
        Submit
      </button>
      <IsBackerSettingCheckBox isBackerProp={data?.is_backer ?? false} />
      <UpdateImgUrl />
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
    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-theme-grey p-10 ">
      <input
        type="checkbox"
        className="h-10 w-10"
        checked={isBacker}
        onChange={handleIsBackerChange}
      />
      <span>I am a backer? Tick and submit</span>
      <button
        className="m-4 rounded-lg bg-theme-header p-3"
        disabled={isBackerLoading}
        onClick={handleIsBackerSubmit}
      >
        Submit
      </button>
      {isBackerError && (
        <p className="text-theme-red">Error, please try again</p>
      )}
    </div>
  );
}

export function UpdateImgUrl() {
  const [imgUrl, setImgUrl] = useState("");
  const {
    mutate: updateImgUrl,
    isLoading: imgUrlLoading,
    isError: imgUrlError,
    isSuccess,
  } = api.users.updateImgUrl.useMutation();
  const ctx = api.useContext();
  if (isSuccess) {
    void ctx.users.invalidate();
  }

  const handleImgUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImgUrl(event.target.value);
  };

  const handleImgUrlSubmit = () => {
    updateImgUrl({ img_url: imgUrl });
    setImgUrl("");
  };

  return (
    <div className="mx-auto flex h-screen flex-col items-center bg-theme-black text-white">
      <h2 className="m-2 text-2xl">Settings</h2>
      <span>Update Img Url</span>
      <input
        className="m-2 rounded-lg p-4 text-theme-black"
        type="text"
        value={imgUrl}
        onChange={handleImgUrlChange}
        placeholder="Enter Img Url"
      />
      <button
        className="m-4 rounded-lg bg-theme-header p-3"
        disabled={imgUrlLoading}
        onClick={handleImgUrlSubmit}
      >
        Update Img
      </button>
      {imgUrlError && <p className="text-theme-red">Error, please try again</p>}
    </div>
  );
}
