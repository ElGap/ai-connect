import { ZodError } from 'zod'
import { ofetch } from "ofetch";
import { LLMProvider, LLMResponse, LLMUsage, StreamChunk } from '../interfaces.js';
import { OllamaOptionsSchema, OllamaProviderOptions, OllamaProviderOptionsInput } from '../validation/ollama-options.schema.js';

const DEFAULT_PROVIDER_SYSTEM_PROMPT = 'You are a helpful and harmless AI assistant.';

export class OllamaProvider implements LLMProvider<OllamaProviderOptions>  {
    private readonly apiUrl: string;
    private readonly config: OllamaProviderOptions;

    constructor(config: OllamaProviderOptionsInput) {
        try {
            this.config = OllamaOptionsSchema.parse(config);
        } catch (error) {
            if (error instanceof ZodError) {
                const errorDetails = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
                throw new Error(`Invalid OllamaProvider configuration: ${errorDetails}`);
            } else {
                throw error;
            }
        }
        this.apiUrl = `${this.config.baseUrl}/api/generate`;
    }

    public async invoke(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
        const maxRetries = 3;
        let lastError: Error | null = null;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const { model, baseUrl, ...options } = this.config;
                const finalSystemPrompt = systemPrompt || DEFAULT_PROVIDER_SYSTEM_PROMPT;

                const body = {
                    model: model,
                    prompt: prompt,
                    system: finalSystemPrompt,
                    stream: false,
                    options: options,
                };

                const APIResponse = await ofetch(`${this.apiUrl}`, {
                    method: 'POST',
                    body: body
                });
                return {
                    content: APIResponse.response.trim() || "",
                    usage: {
                        promptTokens: APIResponse.prompt_eval_count || 0,
                        completionTokens: APIResponse.eval_count || 0,
                        totalTokens: (APIResponse.prompt_eval_count || 0) + (APIResponse.eval_count || 0),
                    }
                }
            } catch (error) {
                lastError = error as Error;
                console.warn(`[ElGap-AI-Connect] Invoke failed (attempt ${i + 1}/${maxRetries}): ${lastError.message}`);
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        console.error(`[ElGap-AI-Connect] Invoke failed after ${maxRetries} retries.`);
        throw new Error(`Ollama API request failed: ${lastError?.message}`);
    }

    public async * stream(
        prompt: string,
        systemPrompt?: string,
        tokenUsage: boolean | undefined = false
): AsyncIterable<StreamChunk> {

            const { model, baseUrl, ...options } = this.config;
            const finalSystemPrompt = systemPrompt || DEFAULT_PROVIDER_SYSTEM_PROMPT;
            const body = {
                model: model,
                prompt: prompt,
                system: systemPrompt || finalSystemPrompt,
                stream: true,
                options: options,
            };
        try {
            const stream = await ofetch.raw(this.apiUrl, {
                method: 'POST',
                body: body,
                responseType: 'stream'
            });
            if (!stream.body) {
                throw new Error('Response body is null.');
            }

            const reader = stream.body.getReader();
            const decoder = new TextDecoder();
            let leftover = '';

            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                const decodedChunk = decoder.decode(value, {stream: true});
                const lines = (leftover + decodedChunk).split('\n');

                leftover = lines.pop() || '';
                for (const line of lines) {
                    if (line.trim() === '') continue;
                    const parsedChunk = JSON.parse(line);
                    if (parsedChunk.done === true && tokenUsage) {
                        const usage: LLMUsage = {
                            promptTokens: parsedChunk.prompt_eval_count || 0,
                            completionTokens: parsedChunk.eval_count || 0,
                            totalTokens: (parsedChunk.prompt_eval_count || 0) + (parsedChunk.eval_count || 0),
                        };
                        yield { type: 'usage', payload: usage };
                        break;
                    }
                    if (parsedChunk.response) {
                        yield { type: 'content', payload: parsedChunk.response };
                    }
                }
            }
        } catch (error) {
            console.error(`[ElGap-AI-Connect] Stream Error: ${(error as Error).message}`);
            throw new Error('Failed to stream response from Ollama.');
        }
    }

    public clone(overrideOptions?: Partial<OllamaProviderOptions>): OllamaProvider {
        const newConfig = { ...this.config, ...overrideOptions };
        return new OllamaProvider(newConfig);
    }
}