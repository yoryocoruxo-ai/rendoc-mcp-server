# Example 3: Completion Certificate from a Saved Template

Use a pre-built certificate template to issue awards, course completions, or recognitions with a single prompt.

## Prompt to Claude

> Find a certificate template in my rendoc account and generate a course completion certificate for María González who finished the "Advanced TypeScript" course on March 28 2026. The instructor is Carlos Ruiz.

## What the assistant does

**Step 1** — Discover available certificate templates:

```json
{
  "tool": "list_templates",
  "arguments": { "category": "CERTIFICATE" }
}
```

The server returns a formatted list of all certificate templates in your account, each with its name, slug, description, paper size, orientation, and unique ID. Example output:

```
Available templates:
- Course Completion Certificate (course-completion) [CERTIFICATE] - Elegant certificate for course completions | A4 landscape | ID: <template-id>
```

**Step 2** — Inspect the chosen template's schema so the assistant knows which fields to pass:

```json
{
  "tool": "preview_template",
  "arguments": { "template_id": "<id-from-step-1>" }
}
```

This returns the template's full markup, styles, JSON schema (the expected data shape), and sample data. The assistant reads the schema to know exactly which fields are required (e.g. `recipient_name`, `course_name`, `completion_date`, `instructor_name`).

**Step 3** — Generate the certificate:

```json
{
  "tool": "generate_document",
  "arguments": {
    "template_id": "<id-from-step-1>",
    "data": {
      "recipient_name": "María González",
      "course_name": "Advanced TypeScript",
      "completion_date": "2026-03-28",
      "instructor_name": "Carlos Ruiz",
      "issue_date": "2026-04-05"
    },
    "orientation": "landscape",
    "filename": "certificate-maria-gonzalez.pdf"
  }
}
```

## Result

The assistant replies:

> Done. Certificate for María González generated: [download link]
> 
> The template uses landscape A4 with a gold border, elegant serif typography, and space for your signature. You can upload a signature image in the rendoc dashboard under template settings to include it automatically in future certificates.

## Why multi-step discovery matters

Notice how the assistant autonomously:
1. Discovered which templates exist (`list_templates`)
2. Learned the required data shape (`preview_template`)
3. Generated the PDF (`generate_document`)

All without you having to remember template IDs, field names, or formats. This is the MCP pattern at its best — the AI navigates your resources, you describe the outcome.
