import { friendshipsRouter } from "./friendship";
import { sessionsRouter } from "./sessions";
import { router } from "@/lib/server/trpc";
import { usersRouter } from "./users";
import { backingsRouter } from "./backings";
import { userBackingsRouter } from "./userBackings";
import { chopsRouter } from "./chop";
import { topUpsRouter } from "./topup";
import { commentsRouter } from "./comments";

export const appRouter = router({
  sessions: sessionsRouter,
  friendships: friendshipsRouter,
  users: usersRouter,
  backings: backingsRouter,
  userBackings: userBackingsRouter,
  chops: chopsRouter,
  topUps: topUpsRouter,
  comments: commentsRouter,
});

export type AppRouter = typeof appRouter;
