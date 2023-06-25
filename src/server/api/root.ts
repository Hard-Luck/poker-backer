import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/users";
import { potsRouter } from "./routers/pots";
import { sessionRouter } from "./routers/sessions";
import { friendsRouter } from "./routers/friends";
import { potAccessRouter } from "./routers/potAccess";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  pots: potsRouter,
  sessions: sessionRouter,
  friends: friendsRouter,
  potAccess: potAccessRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
