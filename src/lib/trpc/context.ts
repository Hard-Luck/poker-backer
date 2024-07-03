import { db } from '@/lib/db/index';
import { getUserAuth } from '@/lib/auth/utils';

export function createTRPCContext(opts: { headers: Headers }) {
  const { session } = getUserAuth();

  return {
    db,
    session: session,
    ...opts,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
