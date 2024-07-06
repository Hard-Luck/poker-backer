import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  } | null;
};

export const getUserAuth =  () => {
  // find out more about setting up 'sessionClaims' (custom sessions) here: https://clerk.com/docs/backend-requests/making/custom-session-token
  const { userId, sessionClaims } = auth();
  if (userId) {
    const firstName = sessionClaims?.firstName as string;
    const lastName = sessionClaims?.lastName as string;
    const name = `${firstName} ${lastName}`;
    const email = sessionClaims?.email as string;
    return {
      session: {
        user: {
          id: userId,
          name,
          email
        },
      },
    } as AuthSession;
  } else {
    return { session: null };
  }
};

export const checkAuth = () => {
  const { userId } = auth();
  if (!userId) redirect('/');
};
