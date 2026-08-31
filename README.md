# Supreme Sniffle — Agentic Solver Extension

Agentic form-filler browser extension built with React + TypeScript and powered by Ollama and DeepSeek. This repository contains the extension code (TypeScript/CSS/HTML) and uses the wxt toolchain for developing, building and packaging the extension.

> Note: package.json lists the project name as `agentic-solver-extension`.

## Why this project

The extension automates and assists with filling forms using an AI agent that can consult local or remote LLMs (via Ollama) and semantic search / retrieval (via DeepSeek) to provide context-aware suggestions and autofill capabilities.

## Key features

- AI-powered form autofill using Ollama + DeepSeek
- Built with React and TypeScript
- Cross-browser development support via wxt (Chrome / Firefox)

## Tech stack

- TypeScript
- React
- wxt (extension dev toolchain)
- Lucide-react for icons

## Quick start

Prerequisites

- Node.js 18+ (or a supported LTS)
- npm or yarn
- (Optional) Ollama server or credentials and DeepSeek API key if you want the agent to access models or retrieval services

Install dependencies

```bash
npm install
# or
# yarn install
```

The repository's package.json already includes a `postinstall` script that runs `wxt prepare` — run it if needed:

```bash
npm run postinstall
```

Development

Start a local development build and hot reload (wxt required):

```bash
npm run dev
# or for Firefox
npm run dev:firefox
```

This will run the wxt dev server and load the extension into the browser in development mode.

Build

To build a production-ready extension bundle:

```bash
npm run build
```

Package / Zip for submission

The project provides a convenience script to package or submit using wxt:

```bash
npm run zip
# runs: wxt submit
```

## Configuration

The repository uses Ollama and DeepSeek integrations. The code expects configuration for the model/retrieval services — how these are supplied depends on the implementation in the codebase (for example an env file, a config module, or runtime options). Add a configuration file or environment variables according to how your code reads them. Common examples:

- OLLAMA_API_URL — URL for an Ollama instance, e.g. `http://localhost:11434`
- DEEPSEEK_API_KEY — API key for DeepSeek

Create a `.env` or `.env.local` (or `src/config.ts`) and provide the keys needed by the extension. If unsure, search the code for usage of `process.env`, `OLLAMA`, or `DEEPSEEK` to find exact variable names and locations.

## Project structure (typical)

A typical layout for a wxt + React extension project looks like:

- src/ — TypeScript source files (UI, agent code, background, content scripts)
- public/ — static assets / manifest files
- package.json — scripts and dependencies

Adjust the structure section above to match the repository if your layout differs.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository and create a topic branch.
2. Implement your change and add tests where appropriate.
3. Open a pull request with a clear description of the change.

If you plan to change the way secrets or API keys are configured, add documentation and examples in this README.

## Troubleshooting

- If wxt commands fail, ensure `wxt` is installed (it is listed as a devDependency) and that your Node version is supported.
- If the extension cannot access Ollama or DeepSeek, confirm the service endpoints and keys are reachable and correct.

## To-do / TODOs

- Add detailed config docs showing the exact environment variables or config file format required by the extension code.
- Add a license file (e.g., MIT) and include a License section here.
- Add screenshots and usage examples demonstrating autofill flows.

## License

This repository does not yet include a LICENSE file. Add a LICENSE file (for example MIT) if you want to make the code open-source.

## Contact

For questions about this repository contact the owner: @rajadaud12
