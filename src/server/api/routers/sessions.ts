import { TRPCError } from "@trpc/server";
import { addSession, canDeleteSession, deleteSession } from "models/sessions";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
    create: privateProcedure
        .input(
            z.object(
                {
                    pot_id: z.number(),
                    amount: z.number(),
                    session_length: z.number().int().min(1),
                    created_at: z.date().optional().default(new Date()),
                }))
        .mutation(({ input, ctx }) => {
            const user_id = ctx.currentUserId as string;
            return addSession(user_id, input)

        }),
    delete: privateProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
        const user_id = ctx.currentUser
        const { id } = input
        if (!await canDeleteSession(id, user_id)) throw new TRPCError({ code: "UNAUTHORIZED" })
        return deleteSession(id)
    })
})
