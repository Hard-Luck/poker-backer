import { useUser } from "@clerk/clerk-react";
import BackerDashboard from "~/components/backer-dashboard/BackerDashboard";
import * as React from "react";
import { api } from "~/utils/api";
import HorseDashboard from "~/components/horse-dashboard/HorseDashboard";
import { useRouter } from "next/router";
import { SignedIn } from "@clerk/nextjs";
import Loading from "~/components/Loading";

export default function Home() {
  const user = useUser().user;
  if (!user) return null;
  return (
    <SignedIn>
      <Dashboard />
    </SignedIn>
  );
}

function Dashboard() {
  const { data, isLoading, isError } = api.users.getCurrentUserInfo.useQuery();
  const router = useRouter();
  const isBacker = data?.is_backer;
  if (isError) void router.push("/settings");

  if (isLoading) return <Loading />;
  if (!data) return <p>missing data</p>;
  return isBacker ? (
    <BackerDashboard userId={data.id} />
  ) : (
    <HorseDashboard userId={data.id} />
  );
}
