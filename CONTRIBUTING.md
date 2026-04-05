# Contributing to `@rendoc/mcp-server`

Thanks for your interest in contributing. This document outlines how to propose changes, report bugs, and submit pull requests.

## Ways to contribute

- **Report a bug** — open a GitHub issue with reproduction steps
- **Suggest a feature** — open a GitHub issue describing the use case
- **Fix a typo or improve docs** — PRs welcome, no issue needed
- **Add an example** — new entries in `examples/` showcasing real-world use cases are always appreciated
- **Security issue** — see [SECURITY.md](./SECURITY.md), do not open a public issue

## Development setup

```bash
git clone https://github.com/yoryocoruxo-ai/rendoc-mcp-server
cd rendoc-mcp-server
npm install
npm run build
```

To test the server locally, set `RENDOC_API_KEY` in your environment and run:

```bash
RENDOC_API_KEY=your-key node dist/index.js
```

The server speaks JSON-RPC over stdio (MCP protocol). You can send handshake messages manually or point a Claude Desktop / Cursor config at the local `dist/index.js` to test end-to-end.

## Pull request guidelines

- **One change per PR**: small, focused PRs get reviewed faster
- **Describe the *why*, not just the *what*** in the PR description
- **Update examples or README** if behavior changes
- **Keep the bundle lean**: this package is designed to be tiny. Avoid adding dependencies unless strictly necessary
- **TypeScript strict**: `npm run build` must pass without warnings
- **Don't break MCP compatibility**: tool schemas are part of the public contract — additive changes only, unless bumping a major version

## Commit style

We follow conventional commits (loosely):

- `feat:` — new tool or capability
- `fix:` — bug fix
- `docs:` — documentation only
- `chore:` — tooling, deps, CI
- `refactor:` — code change without behavior change

Example: `feat: add watermark option to generate_document`

## Questions?

Open a GitHub issue on the repository or reach out via [rendoc.dev](https://rendoc.dev).
