import * as z from 'zod';
import { BaseProviderOptions } from '../interfaces.js';

// export const OllamaOptionsSchema = z.object({
//     model: z.string().min(1, { message: "Model name cannot be empty." }),
//
//     baseUrl: z.url().optional().default('http://localhost:11434'),
//     temperature: z.number().min(0).max(1).optional().default(0.7),
//     topP: z.number().min(0).max(1).optional(),
//     topK: z.number().int().positive().optional(),
//     stop: z.array(z.string()).optional(),
//     numCtx: z.number().int().positive().optional(),
// });
// export type OllamaProviderOptions = z.infer<typeof OllamaOptionsSchema> & BaseProviderOptions;

const OllamaOptionsInputSchema = z.object({
    model: z.string().min(1, { message: "Model name cannot be empty." }),
    baseUrl: z.string().url().optional(),
    temperature: z.number().min(0).max(2).optional(),
    topP: z.number().min(0).max(1).optional(),
    topK: z.number().int().positive().optional(),
    stop: z.array(z.string()).optional(),
    numCtx: z.number().int().positive().optional(),
});

// 2. Definišemo finalnu šemu koja dodaje DEFAULT vrednosti.
export const OllamaOptionsSchema = OllamaOptionsInputSchema.extend({
    baseUrl: OllamaOptionsInputSchema.shape.baseUrl.default('http://localhost:11434'),
    temperature: OllamaOptionsInputSchema.shape.temperature.default(0.7),
});

// 3. Sada eksportujemo DVA tipa
export type OllamaProviderOptionsInput = z.infer<typeof OllamaOptionsInputSchema> & BaseProviderOptions;
export type OllamaProviderOptions = z.infer<typeof OllamaOptionsSchema> & BaseProviderOptions;