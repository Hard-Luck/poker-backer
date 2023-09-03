import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/users";
import { potsRouter } from "./routers/pots";
import { sessionRouter } from "./routers/sessions";
import { friendsRouter } from "./routers/friends";
import { potAccessRouter } from "./routers/potAccess";


import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
})
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
