# Example 1: Generate a Client Invoice

Generate a professional invoice PDF in seconds from structured billing data, using inline Handlebars markup — no template needed.

## Prompt to Claude

> Generate an invoice PDF for my client Acme Corp. Invoice number INV-2026-042, dated April 5th 2026, due April 19th. Two line items: "Website Redesign" 40 hours at €85/hour, and "SEO Consulting" 12 hours at €95/hour. Include 21% VAT. My company is "Studio Mercurio", CIF B12345678, Calle Mayor 10, 28013 Madrid, Spain.

## What the assistant does

The assistant calls `generate_document` with inline markup and structured data:

```json
{
  "tool": "generate_document",
  "arguments": {
    "markup": "<!DOCTYPE html><html><head><style>body{font-family:-apple-system,sans-serif;padding:40px;color:#1a1a1a}.header{display:flex;justify-content:space-between;margin-bottom:40px}.company h1{margin:0;font-size:24px}.meta{text-align:right}.invoice-num{font-size:28px;font-weight:700;color:#0066cc}table{width:100%;border-collapse:collapse;margin:30px 0}th{background:#f5f5f5;padding:12px;text-align:left;border-bottom:2px solid #ddd}td{padding:12px;border-bottom:1px solid #eee}.totals{margin-top:20px;margin-left:auto;width:300px}.totals div{display:flex;justify-content:space-between;padding:8px 0}.total{font-size:20px;font-weight:700;border-top:2px solid #1a1a1a;padding-top:12px!important;margin-top:8px}</style></head><body><div class='header'><div class='company'><h1>{{seller.name}}</h1><p>{{seller.address}}<br>CIF: {{seller.tax_id}}</p></div><div class='meta'><div class='invoice-num'>{{invoice_number}}</div><p>Issue date: {{issue_date}}<br>Due date: {{due_date}}</p></div></div><h3>Bill to:</h3><p><strong>{{client.name}}</strong></p><table><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>{{#each items}}<tr><td>{{description}}</td><td>{{quantity}}</td><td>€{{rate}}</td><td>€{{amount}}</td></tr>{{/each}}</tbody></table><div class='totals'><div><span>Subtotal</span><span>€{{subtotal}}</span></div><div><span>VAT ({{vat_rate}}%)</span><span>€{{vat_amount}}</span></div><div class='total'><span>Total</span><span>€{{total}}</span></div></div></body></html>",
    "data": {
      "invoice_number": "INV-2026-042",
      "issue_date": "2026-04-05",
      "due_date": "2026-04-19",
      "seller": {
        "name": "Studio Mercurio",
        "tax_id": "B12345678",
        "address": "Calle Mayor 10, 28013 Madrid, Spain"
      },
      "client": {
        "name": "Acme Corp"
      },
      "items": [
        { "description": "Website Redesign", "quantity": 40, "rate": 85, "amount": 3400 },
        { "description": "SEO Consulting", "quantity": 12, "rate": 95, "amount": 1140 }
      ],
      "subtotal": 4540,
      "vat_rate": 21,
      "vat_amount": 953.4,
      "total": 5493.4
    },
    "paper_size": "A4",
    "orientation": "portrait",
    "filename": "INV-2026-042.pdf"
  }
}
```

## What the assistant receives

The `generate_document` tool returns a text response like:

```
Document generated successfully!
ID: <document-id>
Download: https://rendoc.dev/documents/<document-id>/download
File: INV-2026-042.pdf
Size: <bytes>
Pages: 1
```

The assistant then shares the download URL with you — ready to send to the client.

## Tip: save it as a template

If you issue invoices frequently, ask the assistant to save the markup as a template with `create_template`. Future invoices then become a one-liner: *"Generate invoice INV-2026-043 for Beta Ltd, 20h of consulting at €100/h."*
