import { getHorseDashboard } from "models/dashboard";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const horseRouter = createTRPCRouter({
    getDashboard: privateProcedure
        .input(z.object({ id: z.string() }))
        .query(({ input }) => {
            const { id } = input
            return getHorseDashboard(id)
        }),
});