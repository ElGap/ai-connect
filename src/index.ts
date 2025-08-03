// src/index.ts

export interface LLMUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export interface LLMResponse {
    content: string;
    usage: LLMUsage;
}

export interface ILLMProvider {
    invoke(prompt: string, systemPrompt?: string): Promise<LLMResponse>;
}

import { ofetch } from 'ofetch';

export interface OllamaProviderOptions {
    model: string;
    baseUrl?: string;
}

export class OllamaProvider implements ILLMProvider {
    private readonly model: string;
    private readonly baseUrl: string;

    constructor(options: OllamaProviderOptions) {
        this.model = options.model;
        this.baseUrl = options.baseUrl || 'http://localhost:11434';
    }

    async invoke(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
        try {
            const response = await ofetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                body: {
                    model: this.model,
                    prompt,
                    system: systemPrompt,
                    stream: false,
                },
            });

            const usage = {
                promptTokens: response.prompt_eval_count || 0,
                completionTokens: response.eval_count || 0,
                totalTokens: (response.prompt_eval_count || 0) + (response.eval_count || 0),
            };

            return {
                content: response.response.trim(),
                usage,
            };
        } catch (error: any) {
            console.error(`[ElGap-AI-Connect] Ollama API Error: ${error.message}`);
            throw new Error('Failed to get response from Ollama.');
        }
    }
}
