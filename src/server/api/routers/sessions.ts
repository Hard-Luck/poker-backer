import { TRPCError } from "@trpc/server";
import { addComment, addSession, canDeleteSession, deleteSession, getSessionWithComments } from "models/sessions";
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
    }),
    createComment: privateProcedure.input(z.object({ session_id: z.number(), comment: z.string().min(2) })).mutation(async ({ input, ctx }) => {
        const user_id = ctx.currentUser
        const { session_id, comment } = input
        return addComment(user_id, session_id, comment)
    }
    ),
    deleteComment: privateProcedure.input(z.object({ user_id: z.string(), comment_id: z.number() })).mutation(async ({ input, ctx }) => {
        const user_id = ctx.currentUser
        const { user_id: comment_user_id, comment_id } = input
        if (user_id !== comment_user_id) throw new TRPCError({ code: "UNAUTHORIZED" })
        return deleteSession(comment_id)
    }),
    listComments: privateProcedure.input(z.object({ session_id: z.number() })).query(async ({ input }) => {
        const { session_id } = input
        return getSessionWithComments(session_id)
    })
})





