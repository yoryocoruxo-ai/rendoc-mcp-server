# @rendoc/mcp-server

[![npm version](https://img.shields.io/npm/v/@rendoc/mcp-server.svg)](https://www.npmjs.com/package/@rendoc/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/yoryocoruxo-ai/rendoc-mcp-server/actions/workflows/ci.yml/badge.svg)](https://github.com/yoryocoruxo-ai/rendoc-mcp-server/actions/workflows/ci.yml)

<a href="https://glama.ai/mcp/servers/@yoryocoruxo-ai/rendoc-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@yoryocoruxo-ai/rendoc-mcp-server/badge" alt="rendoc MCP server" />
</a>

The **rendoc MCP server** lets AI assistants like **Claude Desktop**, **Cursor**, and any other MCP-compatible client generate professional PDF documents on demand. Connect your AI to rendoc and it can create **invoices**, **contracts**, **reports**, **certificates**, and any other PDF — from reusable templates or inline HTML/Handlebars markup — all from a natural language prompt.

> Turn *"Generate an invoice for Acme Corp, 40 hours of consulting at €85/h"* into a delivered PDF in seconds.

## Use Cases

| Use Case | Example Prompt |
|----------|----------------|
| **Invoices** | *"Generate an invoice for client X with these line items..."* |
| **Contracts** | *"Draft a freelance contract for TechStart SL, €18,000 fee, 50% upfront..."* |
| **Certificates** | *"Issue a course completion certificate for María González..."* |
| **Reports** | *"Create a March 2026 sales report with these KPIs..."* |
| **Bulk generation** | *"Generate certificates for all 50 attendees in this CSV"* |
| **Custom documents** | Anything you can describe in HTML + data |

See detailed walkthroughs in [**`examples/`**](./examples/).

## Features

- **7 tools** for document generation, template management, and usage tracking
- **Template-based or inline** — save reusable templates or pass markup on the fly
- **Handlebars syntax** — use `{{variables}}`, `{{#each}}`, `{{#if}}` in your markup
- **Multiple paper sizes** — A4, Letter, Legal, A3, A5, portrait or landscape
- **Schema validation** — templates can declare a JSON Schema so the AI can't pass invalid data
- **Zero config** — just set `RENDOC_API_KEY` and go
- **Lightweight** — ~35 KB unpacked, pure TypeScript, only 2 runtime dependencies
- **Verified on [Glama](https://glama.ai/mcp/servers/@yoryocoruxo-ai/rendoc-mcp-server)** — security, quality, and license checks passed

## Quick Setup for Claude Desktop

Add this to your Claude Desktop configuration file (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "rendoc": {
      "command": "npx",
      "args": ["-y", "@rendoc/mcp-server"],
      "env": {
        "RENDOC_API_KEY": "your-api-key"
      }
    }
  }
}
```

Restart Claude Desktop. The rendoc tools will appear in the MCP tools menu.

## Quick Setup for Claude Code

Add this to your project or global settings (`.claude/settings.json`):

```json
{
  "mcpServers": {
    "rendoc": {
      "command": "npx",
      "args": ["-y", "@rendoc/mcp-server"],
      "env": {
        "RENDOC_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Quick Setup for Cursor

Add to `~/.cursor/mcp.json` (or your project's `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "rendoc": {
      "command": "npx",
      "args": ["-y", "@rendoc/mcp-server"],
      "env": {
        "RENDOC_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Available Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `generate_document` | Generate a PDF from a template or inline markup | `template_id` or `markup`, `data`, `paper_size?`, `orientation?`, `filename?` |
| `list_templates` | List available document templates | `category?` |
| `preview_template` | Inspect a template's markup, styles, and schema | `template_id` |
| `create_template` | Create a new reusable template | `name`, `slug`, `markup`, `schema`, `category?`, `styles?`, `sample_data?`, `paper_size?`, `orientation?`, `is_public?` |
| `delete_template` | Delete a template by ID | `template_id` |
| `get_document` | Get details of a generated document | `document_id` |
| `get_usage` | View monthly API usage statistics | _(none)_ |

Each tool returns structured JSON with download URLs, document IDs, and metadata the assistant can act on.

## Get an API Key

1. Sign up at [rendoc.dev](https://rendoc.dev)
2. Go to the [API Keys dashboard](https://rendoc.dev/dashboard/api-keys)
3. Create a new key and copy it into your MCP client config

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RENDOC_API_KEY` | Yes | — | Your rendoc API key for authentication |
| `RENDOC_API_URL` | No | `https://rendoc.dev` | Base URL for the rendoc API (useful for self-hosted instances) |

## Examples

Detailed walkthroughs with real prompts and tool calls:

- [**01 — Invoice from inline markup**](./examples/01-invoice.md) — single-shot invoice generation
- [**02 — Freelance contract template**](./examples/02-contract.md) — create once, reuse forever
- [**03 — Certificate from saved template**](./examples/03-certificate.md) — multi-step tool discovery
- [**04 — Monthly sales report**](./examples/04-monthly-report.md) — rich visualizations with CSS
- [**05 — Bulk generation from dataset**](./examples/05-bulk-generation.md) — 50 PDFs from one prompt

## How It Works

```
┌──────────────┐   MCP/stdio    ┌────────────────────┐   HTTPS   ┌─────────────┐
│ Claude Code  │ ─────────────▶ │ @rendoc/mcp-server │ ────────▶ │ rendoc API  │
│ / Desktop    │                │   (this package)    │           │  (PDF gen)  │
└──────────────┘ ◀───────────── └────────────────────┘ ◀──────── └─────────────┘
        ▲         tool results                        download URL
        │
        └── User prompt: "Generate an invoice for..."
```

The MCP server translates natural language tool calls from your AI assistant into authenticated REST requests to the rendoc API, and returns structured responses with PDF download URLs.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and PR guidelines.

For security issues, please see [SECURITY.md](./SECURITY.md) and email `info@rendoc.dev` — do not open a public issue.

## Links

- **Website**: [rendoc.dev](https://rendoc.dev)
- **Docs**: [rendoc.dev/docs](https://rendoc.dev/docs)
- **npm Package**: [`@rendoc/mcp-server`](https://www.npmjs.com/package/@rendoc/mcp-server)
- **Glama Listing**: [glama.ai/mcp/servers/@yoryocoruxo-ai/rendoc-mcp-server](https://glama.ai/mcp/servers/@yoryocoruxo-ai/rendoc-mcp-server)
- **Official SDKs**: [`@rendoc/sdk` (TypeScript)](https://www.npmjs.com/package/@rendoc/sdk), [`rendoc` (Python)](https://pypi.org/project/rendoc/)

## License

MIT — see [LICENSE](./LICENSE).
