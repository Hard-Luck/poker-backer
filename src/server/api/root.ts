import { createTRPCRouter } from "~/server/api/trpc";
import { backerRouter } from "./routers/backer";
import { userRouter } from "./routers/users";
import { horseRouter } from "./routers/horse";
import { potsRouter } from "./routers/pots";
import { sessionRouter } from "./routers/sessions";
import { friendsRouter } from "./routers/friends";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  backer: backerRouter,
  users: userRouter,
  horse: horseRouter,
  pots: potsRouter,
  sessions: sessionRouter,
  friends: friendsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
