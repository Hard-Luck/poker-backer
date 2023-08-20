import type { PropsWithChildren } from "react";
import { api } from "~/utils/api";
import Loading from "../Loading";
import NotFound from "../errors/NotFound";

export function HasAccess({
  pot_id,
  children,
}: { pot_id: number } & PropsWithChildren) {
  const { data, isLoading } = api.potAccess.hasAccess.useQuery({ pot_id });
  if (isLoading) return <Loading />;
  if (!data) return <NotFound page="page" />;
  return <>{children}</>;
}
