import { SignOutButton } from "@clerk/nextjs";
import * as React from "react";
import { api } from "~/utils/api";

export interface IHeaderProps {}

export function Header(props: IHeaderProps) {
  const userInfo = api.users.getCurrentUserInfo.useQuery();
  if (!userInfo?.data) return <p>Loading...</p>;
  return (
    <>
      <div className="h-full bg-black text-white">
        Logged in as: {userInfo.data.username}
      </div>
      <SignOutButton />
    </>
  );
}
