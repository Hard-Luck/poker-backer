import { z } from 'zod';

export function parseAndValidateChopSplit(
  chopSplit: string
): Record<string, { split: number; percent: number; username: string }> {
  try {
    const chopSplitSchema = z.record(
      z.object({
        split: z.number(),
        percent: z.number(),
        username: z.string(),
      })
    );
    return chopSplitSchema.parse(JSON.parse(chopSplit));
  } catch (error) {
    throw new Error('Could not be parsed and/or validated.');
  }
}
