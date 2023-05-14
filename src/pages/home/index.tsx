import { useUser } from "@clerk/clerk-react";
import BackerDashboard from "~/components/backer-dashboard/BackerDashboard";
import * as React from "react";
import { api } from "~/utils/api";
import HorseDashboard from "~/components/horse-dashboard/HorseDashboard";
import { useRouter } from "next/router";

export default function Home() {
  const user = useUser().user;
  if (!user) return null;
  return <Dashboard />;
}

function Dashboard() {
  const { data, isError } = api.users.getCurrentUserInfo.useQuery();
  const router = useRouter();
  const isBacker = data?.is_backer;
  if (isError) void router.push("/login");

  if (!data) return <p>missing data</p>;
  if (isBacker) return <BackerDashboard userId={data.id} />;
  return <HorseDashboard userId={data.id} />;
}
