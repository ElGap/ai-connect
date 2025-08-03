import { OllamaProvider, ILLMProvider, LLMResponse } from './src/index.js';

const llm: ILLMProvider = new OllamaProvider({
    model: 'gemma3:27b',
});

async function main() {
    try {
        const response: LLMResponse = await llm.invoke(
            'Write some haiku for programming.'
        );

        console.log('Response:', response.content);
        console.log('Tokens spent:', response.usage.totalTokens);

    } catch (error) {
        console.error("TEST SCRIPT ERROR:");
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Uknown error:", error);
        }
    }
}
main();