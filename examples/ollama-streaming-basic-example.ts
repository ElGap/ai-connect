import { OllamaProvider } from '../src/index.js';

const model: string = 'llama3.1:latest'; //Set model. Only required option, set your own model

// --- Primary Optional ---
//const baseUrl: string = 'http://localhost:11434'; //Default for Ollama, uncomment and change if it's elsewhere
//const temperature: number = 0.1; // 0.1 for precision, 1.0 for creativity. Default is set to 0.7

async function main() {
    const provider = new OllamaProvider({
        model: model,
  //      baseUrl,
  //      temperature,
    });

    const prompt = "Write a short poem about why the sky is blue.";
    const systemPrompt: string = "You are helpful and harmless AI assistant";
    const returnTokenUsage = true;

    console.log(`> User: ${prompt}`);
    console.log(`\n🤖 Agent streaming response:`);

    const stream = provider.stream(prompt, systemPrompt, returnTokenUsage);

    for await (const chunk of stream) {
        if (chunk.type === 'content') {
            process.stdout.write(chunk.payload as string);
        } else if (chunk.type === 'usage' && returnTokenUsage) {
            console.log('\n\n--- USAGE REPORT ---');
            console.log("📊 Token Usage:", chunk.payload);
            console.log('--------------------');
        }
    }
    console.log('\n✅ Stream finished.');
}

main().catch(console.error);