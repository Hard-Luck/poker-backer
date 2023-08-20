import type { PropsWithChildren } from "react";
import { api } from "~/utils/api";
import Loading from "../Loading";

export function HasAccess({
  pot_id,
  children,
}: { pot_id: number } & PropsWithChildren) {
  const { data, isLoading } = api.potAccess.hasAccess.useQuery({ pot_id });
  if (isLoading) return <Loading />;
  if (!data) return null;
  return <>{children}</>;
}
