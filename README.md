# Supreme Sniffle

Supreme Sniffle (package name: `agentic-solver-extension`) is an AI-powered browser extension that assists with intelligent, context-aware form filling. It combines a lightweight React + TypeScript frontend with local/remote language models (via Ollama) and semantic retrieval (via DeepSeek) to provide accurate autofill suggestions for web forms.

Maintainer: Daud Bin Nasar (@rajadaud12)

---

## Features

- Context-aware form autofill powered by LLMs and semantic search
- Works in development for Chrome and Firefox using the wxt toolchain
- Built with React + TypeScript and small runtime dependencies
- Extensible agent pipeline to add custom prompts, retrieval sources, or model backends

## What’s included

- Source code written primarily in TypeScript (frontend, background/content scripts)
- CSS for UI styling and extension popup
- Manifest and static assets prepared for the wxt extension toolchain

## Requirements

- Node.js 18 or later
- npm (or yarn)
- (Optional) Local Ollama server or access to an Ollama-compatible model endpoint
- (Optional) DeepSeek API key for semantic retrieval

## Configuration

Create a file named `.env.local` at the repository root (this file is not checked into source control). The extension reads the following environment variables at build time:

- OLLAMA_API_URL — Base URL of your Ollama instance (example: `http://localhost:11434`) used for model calls.
- DEEPSEEK_API_KEY — API key for DeepSeek retrieval if you use DeepSeek for document search.
- DEEPSEEK_API_URL — (optional) Custom DeepSeek endpoint if not using the default.

Example `.env.local`:

NODE_ENV=development
OLLAMA_API_URL=http://localhost:11434
DEEPSEEK_API_KEY=your_deepseek_key_here
DEEPSEEK_API_URL=https://api.deepseek.example

Note: Inspect the code for any additional config keys if you have modified the project. Search for `process.env` or a `config` module to find exact variable usage.

## Install

Install dependencies and run the repository’s `postinstall` to prepare the wxt toolchain:

```bash
npm install
npm run postinstall
```

The package.json scripts (already present) provide the common workflows:

- `npm run dev` — start the wxt dev server and load the extension in the default browser profile
- `npm run dev:firefox` — start wxt for Firefox
- `npm run build` — create a production build of the extension
- `npm run zip` — package/submit the extension using wxt

## Development and testing

1. Make sure your `.env.local` is configured for development.
2. Run `npm run dev` to start wxt in development mode. wxt will build and load the extension into a browser profile with hot reload.
3. Open the browser’s extensions page and enable developer mode (if required). Use the wxt-provided profile or load the unpacked extension from the wxt output directory when testing manually.

For Firefox, use `npm run dev:firefox` which instructs wxt to start with a Firefox profile.

## Build and package

To prepare a production bundle:

```bash
npm run build
```

To create a distributable zip (wxt submit):

```bash
npm run zip
```

Follow wxt’s prompts (if any) to produce the final packaged artifact.

## How the AI agent works (high level)

1. The extension captures the web form context (labels, surrounding text, and form field types).
2. When the user requests autofill, the agent forms a prompt that includes the captured context and optionally relevant documents from DeepSeek.
3. The prompt is sent to the model endpoint configured through OLLAMA_API_URL. The returned structured response is parsed and applied to the form fields.

The implementation is modular so you can replace or augment the retrieval layer (DeepSeek) or the model backend (Ollama) without changing the UI components.

## Security and privacy

- Secrets such as OLLAMA_API_URL and DEEPSEEK_API_KEY should never be committed to source control. Use `.env.local` or a secure secrets manager.
- If you run Ollama locally, ensure it is not exposed to the public internet unless properly secured.
- The extension only sends form context and optionally retrieval content to the configured LLM/retrieval endpoints — review the code if you require stricter privacy guarantees.

## License

This repository is licensed under the MIT License — see the accompanying LICENSE file for details.

---

## Contact

Maintainer: Daud Bin Nasar (@rajadaud12)
GitHub: https://github.com/rajadaud12/supreme-sniffle
Email: daudnasar16@gmail.com
