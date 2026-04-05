# @rendoc/mcp-server

[![npm version](https://img.shields.io/npm/v/@rendoc/mcp-server.svg)](https://www.npmjs.com/package/@rendoc/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<a href="https://glama.ai/mcp/servers/@yoryocoruxo-ai/rendoc-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@yoryocoruxo-ai/rendoc-mcp-server/badge" alt="rendoc MCP server" />
</a>

The rendoc MCP server lets AI assistants like Claude, Cursor, and other MCP-compatible tools generate professional PDF documents. Connect your AI assistant to rendoc and it can create invoices, contracts, reports, certificates, and any other PDF from templates or inline HTML markup.

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

## Get API Key

Sign up and get your API key at [https://rendoc.dev/dashboard/api-keys](https://rendoc.dev/dashboard/api-keys).

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RENDOC_API_KEY` | Yes | — | Your rendoc API key for authentication |
| `RENDOC_API_URL` | No | `https://rendoc.dev` | Base URL for the rendoc API (useful for self-hosted instances) |

## License

MIT
