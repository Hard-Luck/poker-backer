import { protectedProcedure, router } from '@/lib/server/trpc';
import { searchNotFriendUserByPartialUsername } from '@/models/users';
import { z } from 'zod';
export const usersRouter = router({
  getUserMatchingUserName: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const users = await searchNotFriendUserByPartialUsername(input, userId);
      return users;
    }),
});
