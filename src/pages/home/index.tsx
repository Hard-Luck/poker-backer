import { useUser } from "@clerk/clerk-react";
import * as React from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { SignedIn } from "@clerk/nextjs";
import Loading from "~/components/Loading";
import type { UserInfo } from "@prisma/client";
import FriendsButton from "~/components/dashboard/FriendsButton";
import SessionsThisMonth from "~/components/dashboard/SessionsThisMonth";
import TotalAllFloats from "~/components/dashboard/TotalAllFloats";
import StableButton from "~/components/dashboard/StablesButton";
import RecentSession from "~/components/dashboard/LatestSessions";

export default function Home() {
  const user = useUser().user;
  const { data, isLoading, isError } = api.users.getCurrentUserInfo.useQuery();
  const router = useRouter();
  if (!user) return null;
  if (isError) void router.push("/settings");
  if (isLoading) return <Loading />;
  if (!data) return <p>missing data</p>;
  return (
    <SignedIn>
      <Dashboard user={data} />
    </SignedIn>
  );
}

function Dashboard({ user }: { user: UserInfo }) {
  const { data, isLoading, isError } = api.users.getDashboard.useQuery(
    {
      isBacker: user.is_backer,
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchInterval: 100000,
    }
  );
  if (isLoading) return <Loading />;
  if (isError) return <p>Error</p>;
  if (!data) return <p>Missing data</p>;
  return (
    // 2x2 grid css tailwind classes
    <main className="dark:bg-opacity- m-0 flex min-h-[calc(100vh-4rem)] w-full flex-col items-center bg-theme-black p-0">
      <div id="dashboard-top-container" className="grid grid-cols-2 gap-1">
        <SessionsThisMonth sessions={data.sessionCount} />
        <TotalAllFloats total={data.total} />
        <FriendsButton />
        <StableButton isBacker={user.is_backer} />
      </div>
      <div id="dashboard-bottom-container">
        <div className="col-span-2">
          <RecentSession sessions={data.sessions} />
        </div>
      </div>
    </main>
  );
}
