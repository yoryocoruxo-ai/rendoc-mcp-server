# Examples

Real-world use cases for the rendoc MCP server. Each example shows the conversation flow with an AI assistant (Claude, Cursor, etc.) and the underlying tool calls.

| Example | Use Case | Tools Used |
|---------|----------|------------|
| [01-invoice](./01-invoice.md) | Generate a client invoice from structured data | `generate_document` |
| [02-contract](./02-contract.md) | Create a freelance contract with dynamic clauses | `create_template` + `generate_document` |
| [03-certificate](./03-certificate.md) | Issue a completion certificate from a saved template | `list_templates` + `generate_document` |
| [04-monthly-report](./04-monthly-report.md) | Build a monthly sales report with tables and charts | `generate_document` (inline markup) |
| [05-bulk-generation](./05-bulk-generation.md) | Generate 50 personalized PDFs from a CSV | `list_templates` + `generate_document` (loop) |

## Prerequisites

1. Sign up at [rendoc.dev](https://rendoc.dev) and get an API key from the [dashboard](https://rendoc.dev/dashboard/api-keys).
2. Install the MCP server in your AI assistant — see the [main README](../README.md#quick-setup-for-claude-desktop).
3. Start a conversation and try the prompts below.

## How It Works

The rendoc MCP server exposes 7 tools to your AI assistant:

- **`generate_document`** — Generate a PDF from a saved template (by ID) or inline HTML/Handlebars markup
- **`list_templates`** — Browse available templates, optionally filtered by category
- **`preview_template`** — Inspect a template's markup, styles, and data schema
- **`create_template`** — Save a new reusable template
- **`delete_template`** — Remove a template
- **`get_document`** — Fetch details of a previously generated document
- **`get_usage`** — Check your monthly API quota and usage

All tools return structured responses the assistant can act on, including download URLs for generated PDFs.
