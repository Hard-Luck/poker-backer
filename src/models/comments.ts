import { db } from '@/lib/db';

export async function addComment({
  body,
  sessionId,
  userId,
}: {
  userId: string;
  sessionId: number;
  body: string;
}) {
  return db.sessionComment.create({
    data: { user_id: userId, session_id: sessionId, body },
  });
}

export async function deleteComment({ commentId }: { commentId: number }) {
  return db.sessionComment.delete({ where: { id: commentId } });
}
