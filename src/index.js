// src/index.ts
import { ofetch } from 'ofetch';
export class OllamaProvider {
    model;
    baseUrl;
    constructor(options) {
        this.model = options.model;
        this.baseUrl = options.baseUrl || 'http://localhost:11434';
    }
    async invoke(prompt, systemPrompt) {
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
        }
        catch (error) {
            console.error(`[ElGap-AI-Connect] Ollama API Error: ${error.message}`);
            throw new Error('Failed to get response from Ollama.');
        }
    }
}
//# sourceMappingURL=index.js.map