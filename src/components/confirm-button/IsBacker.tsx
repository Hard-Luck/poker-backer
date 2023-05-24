import { api } from "~/utils/api";

import type { ReactNode } from "react";

interface IsBackerProps {
  pot_id: number;
  children: ReactNode;
}

export default function IsBacker({ pot_id, children }: IsBackerProps) {
  const { data, isLoading } = api.pots.getIsBackerOfPot.useQuery({ pot_id });
  if (!data || isLoading) return null;
  return <>{children}</>;
}
