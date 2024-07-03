'use client';
import { trpc } from '@/lib/trpc/client';
import { type PlayerOrBacker } from '@/models/types';
import { useParams } from 'next/navigation';
import { type FC, type PropsWithChildren, createContext } from 'react';

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
};
export const UsersWithAccessToBackingContext =
  createContext<ContextTupe | null>(null);

const UsersWithAccessToBackingProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { backingId } = useParams() as { backingId: string };

  const { data, isLoading } = trpc.userBackings.listIndividual.useQuery(
    {
      backingId: +backingId,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
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
  return (
    <UsersWithAccessToBackingContext.Provider
      value={{ userDetails: playersWithUserBackingsForPot, isLoading }}
    >
      {children}
    </UsersWithAccessToBackingContext.Provider>
  );
};

export default UsersWithAccessToBackingProvider;
