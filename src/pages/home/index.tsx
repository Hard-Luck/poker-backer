import { useUser } from "@clerk/nextjs";
import BackerDashboard from "~/components/backer-dashboard/BackerDashboard";
import * as React from "react";
import { api } from "~/utils/api";
import HorseDashboard from "~/components/horse-dashboard/HorseDashboard";

export interface IHomeProps {}
export default function Home(props: IHomeProps) {
  const { data } = api.users.getCurrentUserInfo.useQuery();
  const isBacker = data?.is_backer;

  if (!data) return <p>missing data</p>;
  if (isBacker) return <BackerDashboard userId={data.id} />;
}
