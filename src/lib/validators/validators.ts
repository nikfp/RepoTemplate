import { z, string, number } from 'zod';
import type { toZod } from 'tozod';

import type { SendInput } from './validationTypes';

// will raise a compile-time type error if the schema does not produce a valid input
export const sendInputSchema: toZod<SendInput> = z.object({
	words: string().min(5, 'Must be 5 characters'),
	numbers: number().gte(5, 'Must be at least 5')
});

export type Input = SendInput;
