import { getUserById } from "models/users";

import { createTRPCRouter, privateOrNullProcedure, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getCurrentUserInfo: privateOrNullProcedure.query(async ({ ctx }) => {
        if (!ctx.currentUserId) return null;
        return getUserById(ctx.currentUserId)
    }),
});