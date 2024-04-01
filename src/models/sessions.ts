import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import { hasAccessToBacking } from "./userBacking";
import { getLastChop } from "./chops";

interface AddSessionInput {
  backing_id: number;
  amount: number;
  created_at: Date;
  length: number;
  location?: string;
}

export async function getSessionsPlayedThisMonth(user_id: string) {
  return db.session.count({
    where: {
      created_at: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
      user: {
        id: user_id,
      },
    },
  });
}

export async function addSession(user_id: string, session: AddSessionInput) {
  const { amount, backing_id, length, created_at, location } = session;
  const hasAccess = await hasAccessToBacking({
    userId: user_id,
    backingId: backing_id,
  });
  if (!hasAccess) throw new TRPCError({ code: "FORBIDDEN" });
  return db.session.create({
    data: {
      user_id,
      amount,
      backing_id,
      length,
      created_at,
      location,
    },
  });
}

export async function getSessionSinceLastChop(backing_id: number) {
  const lastChop = await getLastChop(backing_id);
  const session = await db.session.findMany({
    where: {
      backing_id: backing_id,
      created_at: { gt: lastChop?.created_at },
    },
  });
  return session;
}
export async function getLastSession(backing_id: number) {
  return db.session.findFirst({
    where: { backing_id },
    orderBy: { created_at: "desc" },
  });
}

export async function deleteSession({ session_id }: { session_id: number }) {}

export async function canDeleteSession(session_id: number, user_id: string) {}

export async function getSessionWithComments({
  sessionId,
  userId,
}: {
  sessionId: number;
  userId: string;
}) {
  return db.session.findFirst({
    where: {
      id: sessionId,
      backing: { access: { some: { user_id: userId } } },
    },
    include: {
      comments: {
        include: {
          user: {
            select: { username: true, img_url: true },
          },
        },
      },
    },
  });
}

export async function getSessionAmounts({
  backingId,
  after = new Date(0),
}: {
  backingId: number;
  after?: Date;
}) {
  return db.session.findMany({
    where: { backing_id: backingId, created_at: { gt: after } },
    select: { amount: true, created_at: true },
  });
}
