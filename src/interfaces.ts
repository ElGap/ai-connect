export interface BaseProviderOptions {
    model: string;
    temperature?: number;
    stop?: string[];
}

export interface LLMUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export interface StreamChunk {
    type: 'content' | 'usage';
    payload: string | LLMUsage;
}

export interface LLMResponse {
    content: string;
    usage: LLMUsage;
}

export interface LLMProvider<T extends BaseProviderOptions>  {
    invoke(prompt: string, systemPrompt?: string): Promise<LLMResponse>;
    stream(prompt: string, systemPrompt?: string, tokenUsage?: boolean ): AsyncIterable<StreamChunk>;
    clone(overrideOptions?: Partial<T>): LLMProvider<T>;
}