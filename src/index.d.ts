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
export interface OllamaProviderOptions {
    model: string;
    baseUrl?: string;
}
export declare class OllamaProvider implements ILLMProvider {
    private readonly model;
    private readonly baseUrl;
    constructor(options: OllamaProviderOptions);
    invoke(prompt: string, systemPrompt?: string): Promise<LLMResponse>;
}
//# sourceMappingURL=index.d.ts.map