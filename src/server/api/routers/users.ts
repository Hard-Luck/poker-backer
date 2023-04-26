import { getUserById } from "models/users";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getCurrentUserInfo: privateProcedure.query(async ({ ctx }) => {
        if (!ctx.currentUserId) return null;
        return getUserById(ctx.currentUserId)
    }),
});