"use client";
import { trpc } from "@/lib/trpc/client";
import { parsePositiveInt } from "@/models/utils/parse";
import { type PlayerOrBacker } from "@/models/types";
import { useParams } from "next/navigation";
import { type FC, type PropsWithChildren, createContext } from "react";

type UsersWithAccessToBacking = Record<
  string,
  {
    username: string;
    type: PlayerOrBacker;
    percent: number;
  }
>;
type ContextTupe = {
  userDetails: UsersWithAccessToBacking;
  isLoading: boolean;
  error: string | null;
};
export const UsersWithAccessToBackingContext =
  createContext<ContextTupe | null>(null);

const UsersWithAccessToBackingProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { backingId } = useParams() as {
    backingId: string;
  };
  const parsedBackingId = parsePositiveInt(backingId);

  const { data, isLoading, error } = trpc.userBackings.listIndividual.useQuery(
    {
      backingId: parsedBackingId ?? 0,
    },
    {
      enabled: parsedBackingId !== null,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
  const playersWithUserBackingsForPot: UsersWithAccessToBacking =
    data?.reduce((acc, { user, percent, type, user_id }) => {
      return {
        ...acc,
        [user_id]: {
          username: user.username,
          type,
          percent,
        },
      };
    }, {}) || {};
  if (isLoading) return null;

  if (error) {
    console.error("Failed to load users with access to backing", {
      backingId: parsedBackingId,
      message: error.message,
    });
  }

  return (
    <UsersWithAccessToBackingContext.Provider
      value={{
        userDetails: playersWithUserBackingsForPot,
        isLoading,
        error: error?.message ?? null,
      }}
    >
      {children}
    </UsersWithAccessToBackingContext.Provider>
  );
};

export default UsersWithAccessToBackingProvider;
