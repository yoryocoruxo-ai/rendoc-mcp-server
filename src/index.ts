#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const API_BASE = process.env.RENDOC_API_URL ?? "https://rendoc.dev";
const API_KEY = process.env.RENDOC_API_KEY ?? "";

function getVersion(): string {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8")) as { version: string };
    return pkg.version;
  } catch {
    return "1.0.0";
  }
}

interface ApiErrorResponse {
  success: false;
  error?: { message?: string };
}

interface ApiSuccessResponse {
  success: true;
  data: Record<string, unknown>;
}

type ApiResponse = ApiErrorResponse | ApiSuccessResponse;

async function apiRequest(path: string, options: RequestInit = {}): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "User-Agent": `rendoc-mcp/${getVersion()}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    return {
      success: false,
      error: { message: `HTTP ${res.status}: ${text}` },
    };
  }

  return res.json() as Promise<ApiResponse>;
}

function errorText(result: ApiErrorResponse, fallback: string): { content: Array<{ type: "text"; text: string }> } {
  return {
    content: [{ type: "text" as const, text: `Error: ${result.error?.message ?? fallback}` }],
  };
}

const VERSION = getVersion();

const server = new McpServer(
  {
    name: "rendoc",
    version: VERSION,
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
    instructions: [
      "rendoc MCP Server lets you generate professional PDF documents from templates and data.",
      "Use `list_templates` to browse available templates, `preview_template` to inspect a template's markup and schema,",
      "and `generate_document` to create a PDF. You can use a saved template by ID or provide inline HTML markup.",
      "Use `create_template` to save new reusable templates and `delete_template` to remove them.",
      "Use `get_document` to check the status of a generated document, and `get_usage` to see your monthly quota.",
      "The `rendoc://templates` resource provides a JSON listing of all templates.",
      "Requires RENDOC_API_KEY environment variable. Get your key at https://rendoc.dev/dashboard/api-keys",
    ].join(" "),
  }
);

// Tool: generate_document
server.tool(
  "generate_document",
  [
    "Generate a PDF document from a template and data. Returns a download URL for the generated PDF.",
    "Provide either `template_id` (to use a saved template) or `markup` (inline HTML/Handlebars template).",
    "The `data` object is injected into the template to produce the final document.",
    "Supports custom paper sizes, orientation, and filenames.",
  ].join(" "),
  {
    template_id: z.string().optional().describe("ID of a saved template to use. Mutually exclusive with markup."),
    markup: z.string().optional().describe("Inline HTML/Handlebars markup template. Use when you don't have a saved template."),
    data: z.record(z.string(), z.unknown()).describe("Key-value data to populate the template placeholders."),
    paper_size: z
      .enum(["A4", "LETTER", "LEGAL", "A3", "A5"])
      .optional()
      .describe("Paper size for the PDF. Defaults to A4."),
    orientation: z
      .enum(["portrait", "landscape"])
      .optional()
      .describe("Page orientation. Defaults to portrait."),
    filename: z.string().optional().describe("Custom filename for the generated PDF (e.g. 'invoice-2024.pdf')."),
  },
  async (args) => {
    try {
      const body: Record<string, unknown> = { data: args.data };

      if (args.template_id) {
        body.template_id = args.template_id;
      } else if (args.markup) {
        body.template = {
          markup: args.markup,
          paper_size: args.paper_size ?? "A4",
          orientation: args.orientation ?? "portrait",
        };
      } else {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: Provide either `template_id` (to use a saved template) or `markup` (inline HTML template). One of them is required.",
            },
          ],
        };
      }

      if (args.filename) {
        body.options = { filename: args.filename };
      }

      const result = await apiRequest("/api/v1/documents/generate", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!result.success) {
        return errorText(result, "Document generation failed");
      }

      const doc = result.data as Record<string, unknown>;
      return {
        content: [
          {
            type: "text" as const,
            text: [
              "Document generated successfully!",
              `ID: ${doc.id}`,
              `Download: ${doc.download_url}`,
              `File: ${doc.file_name}`,
              `Size: ${doc.file_size} bytes`,
              `Pages: ${doc.page_count}`,
              doc.expires_at ? `Expires: ${doc.expires_at}` : "",
            ]
              .filter(Boolean)
              .join("\n"),
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error generating document: ${err instanceof Error ? err.message : String(err)}` }],
      };
    }
  }
);

// Tool: list_templates
server.tool(
  "list_templates",
  [
    "List available document templates. Optionally filter by category.",
    "Returns template names, slugs, categories, descriptions, paper sizes, and IDs.",
    "Use the returned ID with `generate_document` or `preview_template`.",
  ].join(" "),
  {
    category: z
      .enum(["INVOICE", "RECEIPT", "CONTRACT", "REPORT", "LETTER", "CERTIFICATE", "RESUME", "PROPOSAL", "CUSTOM"])
      .optional()
      .describe("Filter templates by category. Omit to list all."),
  },
  async (args) => {
    try {
      const params = args.category ? `?category=${args.category}` : "";
      const result = await apiRequest(`/api/v1/templates${params}`);

      if (!result.success) {
        return errorText(result, "Failed to list templates");
      }

      const data = result.data as { templates: Array<Record<string, unknown>> };
      const templates = data.templates;

      if (templates.length === 0) {
        return { content: [{ type: "text" as const, text: "No templates found." }] };
      }

      const list = templates
        .map(
          (t) =>
            `- ${t.name} (${t.slug}) [${t.category}] - ${(t.description as string) ?? "No description"} | ${t.paperSize} ${t.orientation} | ID: ${t.id}`
        )
        .join("\n");

      return { content: [{ type: "text" as const, text: `Available templates:\n${list}` }] };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error listing templates: ${err instanceof Error ? err.message : String(err)}` }],
      };
    }
  }
);

// Tool: get_document
server.tool(
  "get_document",
  [
    "Get details about a previously generated document by its ID.",
    "Returns the document status, download URL, file size, page count, and creation date.",
  ].join(" "),
  {
    document_id: z.string().describe("The document ID returned from generate_document."),
  },
  async (args) => {
    try {
      const result = await apiRequest(`/api/v1/documents/${args.document_id}`);

      if (!result.success) {
        return errorText(result, "Document not found");
      }

      const doc = result.data as Record<string, unknown>;
      return {
        content: [
          {
            type: "text" as const,
            text: [
              `Document: ${doc.file_name}`,
              `Status: ${doc.status}`,
              `Download: ${(doc.download_url as string) ?? "N/A"}`,
              `Size: ${(doc.file_size as string) ?? "N/A"} bytes`,
              `Pages: ${(doc.page_count as string) ?? "N/A"}`,
              `Created: ${doc.created_at}`,
            ].join("\n"),
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error fetching document: ${err instanceof Error ? err.message : String(err)}` }],
      };
    }
  }
);

// Tool: get_usage
server.tool(
  "get_usage",
  [
    "Get current API usage statistics for this billing month.",
    "Returns your plan name, document count vs limit, page count, and remaining quota.",
  ].join(" "),
  {},
  async () => {
    try {
      const result = await apiRequest("/api/v1/usage");

      if (!result.success) {
        return errorText(result, "Failed to get usage");
      }

      const u = result.data as {
        plan: string;
        period: { year: number; month: number };
        usage: { documents: number; limit: number; percentage: number; pages: number; remaining: number };
      };
      return {
        content: [
          {
            type: "text" as const,
            text: [
              `Plan: ${u.plan}`,
              `Period: ${u.period.year}-${String(u.period.month).padStart(2, "0")}`,
              `Documents: ${u.usage.documents} / ${u.usage.limit} (${u.usage.percentage}%)`,
              `Pages: ${u.usage.pages}`,
              `Remaining: ${u.usage.remaining}`,
            ].join("\n"),
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error fetching usage: ${err instanceof Error ? err.message : String(err)}` }],
      };
    }
  }
);

// Tool: preview_template
server.tool(
  "preview_template",
  [
    "Get the full markup, styles, and data schema of a template.",
    "Use this to inspect a template before generating a document.",
    "The schema shows which data fields the template expects.",
    "Sample data (if available) shows example values for each field.",
  ].join(" "),
  {
    template_id: z.string().describe("The template ID to preview. Get IDs from list_templates."),
  },
  async (args) => {
    try {
      const result = await apiRequest(`/api/v1/templates/${args.template_id}`);

      if (!result.success) {
        return errorText(result, "Template not found");
      }

      const data = result.data as { template: Record<string, unknown> };
      const t = data.template;
      return {
        content: [
          {
            type: "text" as const,
            text: [
              `Template: ${t.name} (${t.slug})`,
              `Category: ${t.category}`,
              `Paper: ${t.paperSize} ${t.orientation}`,
              `Description: ${(t.description as string) ?? "None"}`,
              `\nMarkup:\n${t.markup}`,
              t.styles ? `\nStyles:\n${t.styles}` : "",
              `\nSchema:\n${JSON.stringify(t.schema, null, 2)}`,
              t.sampleData ? `\nSample data:\n${JSON.stringify(t.sampleData, null, 2)}` : "",
            ]
              .filter(Boolean)
              .join("\n"),
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error previewing template: ${err instanceof Error ? err.message : String(err)}` }],
      };
    }
  }
);

// Tool: create_template
server.tool(
  "create_template",
  [
    "Create a new reusable document template.",
    "Templates use HTML/Handlebars markup with a JSON schema defining the expected data fields.",
    "Once created, use the returned template ID with `generate_document` to produce PDFs.",
  ].join(" "),
  {
    name: z.string().describe("Display name for the template (e.g. 'Monthly Invoice')."),
    slug: z.string().describe("URL-friendly identifier (e.g. 'monthly-invoice'). Must be unique."),
    description: z.string().optional().describe("Short description of what this template generates."),
    category: z
      .enum(["INVOICE", "RECEIPT", "CONTRACT", "REPORT", "LETTER", "CERTIFICATE", "RESUME", "PROPOSAL", "CUSTOM"])
      .optional()
      .describe("Template category. Defaults to CUSTOM."),
    markup: z.string().describe("HTML/Handlebars markup for the template body."),
    styles: z.string().optional().describe("CSS styles to apply to the template."),
    schema: z.record(z.string(), z.unknown()).describe("JSON schema defining the data fields the template expects."),
    sample_data: z.record(z.string(), z.unknown()).optional().describe("Example data matching the schema, used for previews."),
    paper_size: z
      .enum(["A4", "LETTER", "LEGAL", "A3", "A5"])
      .optional()
      .describe("Paper size. Defaults to A4."),
    orientation: z
      .enum(["portrait", "landscape"])
      .optional()
      .describe("Page orientation. Defaults to portrait."),
    is_public: z.boolean().optional().describe("Whether the template is publicly visible. Defaults to false."),
  },
  async (args) => {
    try {
      const body: Record<string, unknown> = {
        name: args.name,
        slug: args.slug,
        markup: args.markup,
        schema: args.schema,
      };

      if (args.description !== undefined) body.description = args.description;
      if (args.category !== undefined) body.category = args.category;
      if (args.styles !== undefined) body.styles = args.styles;
      if (args.sample_data !== undefined) body.sample_data = args.sample_data;
      if (args.paper_size !== undefined) body.paper_size = args.paper_size;
      if (args.orientation !== undefined) body.orientation = args.orientation;
      if (args.is_public !== undefined) body.is_public = args.is_public;

      const result = await apiRequest("/api/v1/templates", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!result.success) {
        return errorText(result, "Failed to create template");
      }

      const t = result.data as Record<string, unknown>;
      return {
        content: [
          {
            type: "text" as const,
            text: [
              "Template created successfully!",
              `ID: ${t.id}`,
              `Name: ${t.name}`,
              `Slug: ${t.slug}`,
              `Category: ${t.category ?? "CUSTOM"}`,
            ].join("\n"),
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error creating template: ${err instanceof Error ? err.message : String(err)}` }],
      };
    }
  }
);

// Tool: delete_template
server.tool(
  "delete_template",
  "Delete a template by its ID. This action is irreversible. Only templates you own can be deleted.",
  {
    template_id: z.string().describe("The ID of the template to delete."),
  },
  async (args) => {
    try {
      const result = await apiRequest(`/api/v1/templates/${args.template_id}`, {
        method: "DELETE",
      });

      if (!result.success) {
        return errorText(result, "Failed to delete template");
      }

      return {
        content: [{ type: "text" as const, text: `Template ${args.template_id} deleted successfully.` }],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error deleting template: ${err instanceof Error ? err.message : String(err)}` }],
      };
    }
  }
);

// Resource: templates listing
server.resource(
  "templates",
  "rendoc://templates",
  { description: "JSON listing of all available document templates", mimeType: "application/json" },
  async () => {
    const result = await apiRequest("/api/v1/templates");
    const data = result.success ? (result.data as { templates?: unknown }).templates ?? [] : [];
    return {
      contents: [
        {
          uri: "rendoc://templates",
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

// Start server
async function main(): Promise<void> {
  if (!API_KEY) {
    process.stderr.write(
      "Error: RENDOC_API_KEY environment variable is required.\n" +
        "Get your API key at https://rendoc.dev/dashboard/api-keys\n"
    );
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err: unknown) => {
  process.stderr.write(`Fatal error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
