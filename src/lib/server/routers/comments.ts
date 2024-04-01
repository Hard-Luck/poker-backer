import { protectedProcedure, router } from "@/lib/server/trpc";
import { chop } from "@/models/chops";
import { addComment, deleteComment } from "@/models/comments";
import { z } from "zod";

export const commentsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        body: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { sessionId, body } = input;
      const userId = ctx.session.user.id;
      return addComment({ sessionId, userId, body });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        commentId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { commentId } = input;
      return deleteComment({ commentId });
    }),
});
