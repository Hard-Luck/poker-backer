import { getBackerDashboard } from "models/dashboard";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const backerRouter = createTRPCRouter({
    getDashboard: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(({ input }) => {
            const { id } = input
            return getBackerDashboard(id)
        }),
});