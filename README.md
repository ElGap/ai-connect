# @elgap/ai-connect

[![npm version](https://badge.fury.io/js/%40elgap%2Fai-connect.svg)](https://badge.fury.io/js/%40elgap%2Fai-connect)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A minimalist, "no-fluff" TypeScript client for interacting with open-source Large Language Models via the Ollama API.

### Philosophy

The world of AI is complex enough. Interacting with your local models shouldn't be.`@elgap/ai-connect` is designed
with one core principle: **Substance First**. We provide a simple, reliable, and type-safe way to send a prompt and
get a response, without the heavy abstractions of larger frameworks.

### Note on the ElGap Ecosystem
`@elgap/ai-connect` is the foundational "engine" package for the ElGap ecosystem. It is designed to be a simple, 
resilient, and provider-agnostic client. For more advanced, "out-of-the-box" agentic capabilities like 
constitution-based guardrails, chat history ... please see our companion package, [`@elgap/ai-composer`](https://github.com/ElGap/ai-composer)

Both, `@elgap/ai-connect` and [@elgap/ai-composer](https://github.com/ElGap/ai-composer) are under continuous 
development. At the moment they support only `/api/generate` Ollama endpoint (single response object or stream of objects).

### A Note on Co-Creation

This package was co-created in a deep, multi-month symbiotic dialogue between a human WedDev artisan 
[Ivan Pavković](https://pavko.info) and AI (Google's Gemini). The process served as both a real-world 
case study in Human-AI partnership and as a practical journey for Ivan to learn TypeScript, npm package creation and to 
dive into the world of LLM's. The code you see is a direct result of this iterative, "sparring" process.

### Features

- Lightweight and zero-dependency (aside from `ofetch` and `zod`).
- Simple, intuitive API (`invoke` method). 
- Built-in token count usage
- Type-safe interfaces for requests and responses.
- Designed for modern TypeScript/JavaScript projects.

### Installation

```bash
npm install @elgap/ai-connect
```

### Quick Start
```ts
import { OllamaProvider } from "@elgap/ai-connect";

async function main () {
    const llama3 = new OllamaProvider( {
        model: "llama3.1:latest", //Adjust model name to match your local model
        baseUrl: "http://localhost:11434", //Optional. Default for Ollama, change if it's elsewhere
        temperature: 0.7 //Optional. Default to 0.7 but you can change it from 0-1)
    })
    const systemPrompt = "You are helpful and harmless AI assistant";
    const prompt: string = "Why the sky is blue?"
    const response = await llama3.invoke(prompt, systemPrompt);
    console.log("Response:", response.content);
    console.log("Token usage:", response.usage);
}
main().catch(console.error);
```

### Examples
You can find a collection of ready-to-run examples in the /examples directory. We encourage you to clone the repository 
and experiment.

```shell
git clone git@github.com:ElGap/ai-connect.git
npm install

npm run example:ollama
npm run example:ollamaStreaming
npm run example:ollamaStreamingInteractive
```

### API Reference
```ts
new OllamaProvider(options)
```
- options.model: string - The name of the model to use (e.g., 'llama3:8b').
- options.baseUrl?: string - The base URL of your Ollama instance. Defaults to `http://localhost:11434`.
- options.temperature? : Number - Temperature (default 0.7)
```ts
provider.invoke(prompt, systemPrompt, tokenUsage)
```
- prompt: string - The text prompt you want to send to the model.
- systemPrompt: string - System prompt
- tokenUsage: boolean - Return token usage if set to true
- Returns: Promise<OllamaResponse> - An object containing the response text and metadata.

### Licence

This project is licensed under the Apache 2.0 License.
