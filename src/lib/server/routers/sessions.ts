import { protectedProcedure, router } from '@/lib/server/trpc';
import { addSession, canDeleteSession, deleteSession } from '@/models/sessions';
import { z } from 'zod';

export const sessionsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        length: z.number(),
        date: z.date(),
        location: z.string().optional(),
        backingId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { amount, length, date, location, backingId } = input;
      const { id } = ctx.session.user;
      return addSession(id, {
        amount,
        length,
        created_at: date,
        location,
        backing_id: parseInt(backingId),
      });
    }),
  delete: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { sessionId } = input;
      const userId = ctx.session.user.id;
      if (!(await canDeleteSession(sessionId, userId))) {
        throw new Error('Forbidden');
      }
      return deleteSession({ sessionId: sessionId });
    }),
});
