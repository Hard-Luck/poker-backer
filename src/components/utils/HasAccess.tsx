import type { PropsWithChildren } from "react";
import { api } from "@/utils/api";
import Loading from "../Loading";
import NotFound from "../errors/NotFound";

export function HasAccess({
  backing_id,
  children,
}: { backing_id: number } & PropsWithChildren) {
  const { data, isLoading } = api.userBacking.hasAccess.useQuery({
    backing_id,
  });
  if (isLoading) return <Loading />;
  if (!data) return <NotFound page="page" />;
  return <>{children}</>;
}
