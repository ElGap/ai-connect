import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import {OllamaProvider, OllamaProviderOptionsInput } from '../src/index.js';

// =============================================================
// === Configuration Block - Adjust these values for testing ===
// =============================================================

// --- Required ---
const model: string = 'llama3.1:latest'; //Set model. Only required option, set your own model

// --- Primary Optional ---
const baseUrl: string = 'http://localhost:11434'; //Default for Ollama, uncomment and change if it's elsewhere
const temperature: number = 0.7; // 0.1 for precision, 1.0 for creativity. Default is set to 0.7

// --- Advanced Optional (Uncomment and change 'undefined' to a value to test) ---
// const topP: number | undefined = undefined;         // e.g., 0.9
// const topK: number | undefined = undefined;         // e.g., 50
// const stop: string[] | undefined = undefined;       // e.g., ["\n", "User:"]
// const numCtx: number | undefined = undefined;       // e.g., 4096

// =============================================================


const systemPrompt: string = "You are helpful and harmless AI assistant";
const returnTokenUsage = true;

async function main() {
    console.log(`
  =================================================
  🚀 @elgap/ai-connect - Interactive Prompt Example
  =================================================
  Model in use: ${model}
  (Type 'exit' to quit)
  `);

    const rl = readline.createInterface({ input, output });

    /**
     * If you uncommented and declared advanced options in configuration block above, uncomment them here as well
     */
    const options: OllamaProviderOptionsInput = {
        model: model,
    };

    try {
        //console.log("Initializing LLM provider with options:", options);
        const provider = new OllamaProvider(options);

        console.log("✅ Provider is ready. Enter your prompt.\n");

        while (true) {
            const userInput = await rl.question('>> ');
            if (userInput.toLowerCase() === 'exit') break;

            console.log(`🤖 Invoking model...`);

            const stream = provider.stream(userInput, systemPrompt, returnTokenUsage);

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
    } catch (error) {
        console.error("\n❌ An error occurred:", (error as Error).message);
    } finally {
        rl.close();
    }
}

main().catch(error => {
    console.error("\n❌ A fatal application error occurred:", error);
    process.exit(1);
});