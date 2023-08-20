import {
  createPotAccess,
  getAccessByPotId,
  hasAccessToPot,
  patchPercentages,
} from "~/models/potAceess";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const potAccessRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        user_id: z.string(),
        pot_id: z.number(),
        type: z.number().int().min(0).max(1),
      })
    )
    .mutation(async ({ input }) => {
      return createPotAccess(input);
    }),
  patchPercent: privateProcedure
    .input(
      z.object({
        pot_id: z.number(),
        percentages: z.array(
          z.object({
            user_id: z.string(),
            percent: z.number().min(0).max(100),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const { pot_id, percentages } = input;
      return patchPercentages(pot_id, percentages);
    }),
  getAccessByPotId: privateProcedure
    .input(z.object({ pot_id: z.number() }))
    .query(async ({ input }) => {
      const { pot_id } = input;
      return getAccessByPotId(pot_id);
    }),
  hasAccess: privateProcedure
    .input(z.object({ pot_id: z.number() }))
    .query(async ({ input, ctx }) => {
      const user_id = ctx.currentUser;
      return hasAccessToPot(user_id, input.pot_id);
    }),
});
