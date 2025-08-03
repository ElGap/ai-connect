# @elgap/ai-connect

[![npm version](https://badge.fury.io/js/%40elgap%2Fai-connect.svg)](https://badge.fury.io/js/%40elgap%2Fai-connect)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A minimalist, "no-fluff" TypeScript client for interacting with open-source Large Language Models via the Ollama API.

### Philosophy

The world of AI is complex enough. Interacting with your local models shouldn't be.`@elgap/ai-connect` is designed
with one core principle: **Substance First**. We provide a simple, reliable, and type-safe way to send a prompt and
get a response, without the heavy abstractions of larger frameworks.

### Features

-   Lightweight and zero-dependency (aside from `ofetch`).
-   Simple, intuitive API (`invoke` method).
-   Type-safe interfaces for requests and responses.
-   Designed for modern TypeScript/JavaScript projects.

### Installation

```bash
npm install @elgap/ai-connect
```

### Usage
```ts
import { OllamaProvider } from '@elgap/ai-connect';
async function main() {
  // Initialize the provider for a specific model
  const llama3 = new OllamaProvider({
    model: 'llama3:8b-instruct',
    baseUrl: 'http://localhost:11434', // Default Ollama URL
  });

  console.log('Pinging Llama 3...');

  // Use the invoke method to send a prompt
  const response = await llama3.invoke('Why is the sky blue?');

  console.log('Response from agent:');
  console.log(response);
}

main().catch(console.error);
```

### API Reference
```ts
new OllamaProvider(options)
```
- options.model: string - The name of the model to use (e.g., 'llama3:8b').
- options.baseUrl?: string - The base URL of your Ollama instance. Defaults to http://localhost:11434.

```ts
provider.invoke(prompt)
```
- prompt: string - The text prompt you want to send to the model.
- Returns: Promise<OllamaResponse> - An object containing the response text and metadata.


### Licence

This project is licensed under the Apache 2.0 License.

