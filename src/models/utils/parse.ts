import { z } from 'zod';

export function parsePositiveInt(
  value: string | number | null | undefined
): number | null {
  if (typeof value === 'number') {
    return Number.isInteger(value) && value > 0 ? value : null;
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

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
