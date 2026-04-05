# Example 5: Bulk PDF Generation from a Dataset

Generate dozens or hundreds of personalized PDFs in a single conversation — certificates for a workshop, invoices for a batch of customers, or personalized reports.

## Use case

You have a list of 50 workshop attendees in a CSV or JSON file and need to issue a completion certificate to each one.

## Prompt to Claude

> I have this list of 50 workshop attendees (attached JSON). Generate a completion certificate for each one using my "workshop-certificate" template, with today's date as the issue date. Return a table with all the download links at the end.

Attached data:
```json
[
  { "name": "Ana Pérez",  "email": "ana@example.com",  "score": 92 },
  { "name": "Luis Gómez", "email": "luis@example.com", "score": 87 },
  { "name": "Sara López", "email": "sara@example.com", "score": 95 }
  // ... 47 more
]
```

## What the assistant does

**Step 1** — Find the template:

```json
{ "tool": "list_templates", "arguments": { "category": "CERTIFICATE" } }
```

**Step 2** — Loop through the dataset, calling `generate_document` 50 times. A capable assistant will parallelize these calls where possible:

```json
{
  "tool": "generate_document",
  "arguments": {
    "template_id": "<workshop-certificate-template-id>",
    "data": {
      "recipient_name": "Ana Pérez",
      "score": 92,
      "workshop_name": "Advanced TypeScript Workshop",
      "issue_date": "2026-04-05"
    },
    "filename": "certificate-ana-perez.pdf"
  }
}
```

...repeated for each attendee.

**Step 3** — Check usage to confirm quota:

```json
{ "tool": "get_usage", "arguments": {} }
```

**Step 4** — Return a summary table:

| Attendee | Score | Certificate |
|----------|-------|-------------|
| Ana Pérez | 92 | [Download](https://rendoc.dev/documents/doc_...) |
| Luis Gómez | 87 | [Download](https://rendoc.dev/documents/doc_...) |
| Sara López | 95 | [Download](https://rendoc.dev/documents/doc_...) |
| ... | ... | ... |

## Performance considerations

- **Rate limits**: rendoc enforces per-plan rate limits. For bulk jobs, make sure your plan's rate limits accommodate the volume, or space the calls over time.
- **Quota**: each generation counts toward your monthly document allowance. Check with `get_usage` before and after.
- **Parallelism**: the MCP server accepts concurrent calls. If your AI client runs multiple tool calls in parallel, you can batch several at a time.
- **Direct API for huge batches**: for thousands of documents, consider calling the rendoc REST API directly or using the official SDKs ([`@rendoc/sdk`](https://www.npmjs.com/package/@rendoc/sdk) for TypeScript, [`rendoc`](https://pypi.org/project/rendoc/) for Python) from a script. The MCP server is optimized for interactive AI workflows, not ETL-scale batches.

## Combining with other MCP servers

Bulk generation becomes even more powerful when combined with other MCP servers in the same conversation:

- **CSV/Excel MCP** → read the attendee list
- **rendoc MCP** → generate the certificates
- **Email/Gmail MCP** → send each certificate to its recipient
- **Google Drive MCP** → archive all generated PDFs to a shared folder

All orchestrated by the AI assistant in a single prompt: *"For each attendee in attendees.csv, generate a certificate and email it to them."*
