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
import AddSessionButton from "~/components/dashboard/AddSessionButton";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import axios from "axios";

export default function Home() {
  const user = useUser().user;
  const { data, isLoading, isError } = api.users.getCurrentUserInfo.useQuery();
  const router = useRouter();
  if (!user) return null;
  if (isError) void router.push("/settings");
  if (isLoading) return <Loading />;
  if (!data) return <p>missing data</p>;

  const beamsClient = new PusherPushNotifications.Client({
    instanceId: "ff65ef1d-ab85-4bb4-ad8c-66732624ffe6",
  });

  beamsClient
    .start()
    .then(() => beamsClient.getDeviceId())
    .then((deviceId) =>
      console.log("Successfully registered with Beams. Device ID:", deviceId)
    )
    .then(() => beamsClient.addDeviceInterest("hello"))
    .then(() => beamsClient.getDeviceInterests())
    .then((interests) => console.log("Current interests:", interests))
    .catch(console.error);

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

  const instanceID = "ff65ef1d-ab85-4bb4-ad8c-66732624ffe6";

  const sendNoti = () => {
    axios.post(
      `https://${instanceID}.pushnotifications.pusher.com/publish_api/v1/instances/${instanceID}/publishes/interests`,
      {
        interests: ["hello"],
        web: {
          notification: {
            title: "Hello",
            body: "Hello, world!",
            deep_link: "https://www.pusher.com",
          },
        },
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer E44FE6DE7F0F7096BA954047BB05A80C97001D6A90C738F045A9A9D0E04839D0`,
        },
      }
    );
    // fetch(
    //   `https://${instanceID}.pushnotifications.pusher.com/publish_api/v1/instances/${instanceID}/publishes/interests`,
    //   {
    //     mode: "no-cors",
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer E44FE6DE7F0F7096BA954047BB05A80C97001D6A90C738F045A9A9D0E04839D0`,
    //     },
    //     body: JSON.stringify({
    //       interests: ["hello"],
    //       web: {
    //         notification: {
    //           title: "Hello",
    //           body: "Hello, world!",
    //           deep_link: "https://www.pusher.com",
    //         },
    //       },
    //     }),
    //   }
    // );
  };

  return (
    // 2x2 grid css tailwind classes
    <main className="dark:bg-opacity- m-0 flex h-[calc(100vh-4rem)] w-full flex-col items-center  bg-theme-black p-0">
      <h2 className="p-8 text-4xl font-bold text-white">
        Hey, {user.username}
      </h2>
      <button onClick={sendNoti}>sendi</button>
      <div id="dashboard-top-container" className="mb-2 grid grid-cols-2 gap-1">
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
      <AddSessionButton />
    </main>
  );
}
