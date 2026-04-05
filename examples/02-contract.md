# Example 2: Freelance Contract with Dynamic Clauses

Create a reusable contract template once, then generate fully customized contracts for each new client in seconds.

## Part 1 — Create the template (one time)

### Prompt

> Create a freelance services contract template. Fields needed: client name, client address, project description, start date, end date, total fee, payment terms, and a list of deliverables. Include standard clauses for confidentiality, IP ownership, and termination.

### What the assistant does

Calls `create_template` with the full markup and a JSON schema that validates future data:

```json
{
  "tool": "create_template",
  "arguments": {
    "name": "Freelance Services Contract",
    "slug": "freelance-contract",
    "category": "CONTRACT",
    "markup": "<html>...full Handlebars markup with {{client.name}}, {{#each deliverables}}, etc...</html>",
    "schema": {
      "type": "object",
      "required": ["client", "project", "fee", "deliverables"],
      "properties": {
        "client": {
          "type": "object",
          "required": ["name", "address"],
          "properties": {
            "name": { "type": "string" },
            "address": { "type": "string" }
          }
        },
        "project": {
          "type": "object",
          "properties": {
            "description": { "type": "string" },
            "start_date": { "type": "string", "format": "date" },
            "end_date": { "type": "string", "format": "date" }
          }
        },
        "fee": {
          "type": "object",
          "properties": {
            "total": { "type": "number" },
            "currency": { "type": "string", "default": "EUR" },
            "payment_terms": { "type": "string" }
          }
        },
        "deliverables": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "paper_size": "A4",
    "is_public": false
  }
}
```

The server responds with a text confirmation including the new template's ID, name, slug, and category. The assistant remembers this ID for step 2.

## Part 2 — Generate a contract for a new client

### Prompt

> Generate a contract using the freelance template. Client: TechStart SL, Avenida Diagonal 500 Barcelona. Project: "Mobile app MVP in React Native", April 10 to June 30 2026. Fee €18,000, 50% upfront and 50% on delivery. Deliverables: wireframes, iOS build, Android build, deployment to stores.

### What the assistant does

Calls `generate_document` referencing the saved template ID from step 1:

```json
{
  "tool": "generate_document",
  "arguments": {
    "template_id": "<id-from-step-1>",
    "data": {
      "client": {
        "name": "TechStart SL",
        "address": "Avenida Diagonal 500, Barcelona"
      },
      "project": {
        "description": "Mobile app MVP in React Native",
        "start_date": "2026-04-10",
        "end_date": "2026-06-30"
      },
      "fee": {
        "total": 18000,
        "currency": "EUR",
        "payment_terms": "50% upfront, 50% on delivery"
      },
      "deliverables": [
        "Wireframes and UX flows",
        "iOS production build",
        "Android production build",
        "Deployment to App Store and Google Play"
      ]
    },
    "filename": "contract-techstart-2026-04.pdf"
  }
}
```

## Why this pattern wins

- **Consistency**: every contract follows the same legal structure
- **Speed**: 10 seconds per contract vs 30 minutes of manual Word editing
- **Schema validation**: the AI can't forget a required field — rendoc rejects invalid data
- **Audit trail**: every generated document is stored with a unique ID in your rendoc dashboard
