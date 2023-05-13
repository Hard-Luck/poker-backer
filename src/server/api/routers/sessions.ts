import { addSession } from "models/sessions";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
    create: privateProcedure
        .input(
            z.object(
                {
                    pot_id: z.number(),
                    amount: z.number(),
                    session_length: z.number(),
                    created_at: z.date().optional().default(new Date()),
                }))
        .mutation(({ input, ctx }) => {
            const user_id = ctx.currentUserId as string;
            return addSession(user_id, input)

        }),

})
