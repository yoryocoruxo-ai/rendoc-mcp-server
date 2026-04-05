# Example 4: Monthly Sales Report

Generate a branded monthly report with tables, KPI cards, and chart-like visualizations — all from a natural language prompt.

## Prompt to Claude

> Generate a March 2026 sales report for my company. Revenue: €142,500 (up 18% vs February). New customers: 47. Top 3 products: "Pro Plan" (€82k), "Team Plan" (€38k), "Enterprise" (€22k). Regions: Spain 45%, France 28%, Germany 18%, other 9%. Include a summary paragraph highlighting the strong growth.

## What the assistant does

Uses `generate_document` with rich inline markup — no pre-existing template needed:

```json
{
  "tool": "generate_document",
  "arguments": {
    "markup": "<html><head><style>body{font-family:-apple-system,sans-serif;margin:40px;color:#1a1a1a}h1{font-size:32px;margin:0 0 8px}.period{color:#666;margin-bottom:30px}.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:30px 0}.kpi{background:#f8f9fa;padding:20px;border-radius:8px;border-left:4px solid #0066cc}.kpi-label{font-size:12px;text-transform:uppercase;color:#666;letter-spacing:0.5px}.kpi-value{font-size:28px;font-weight:700;margin-top:4px}.kpi-change{font-size:13px;color:#00a86b;margin-top:4px}h2{font-size:20px;margin-top:40px;border-bottom:2px solid #eee;padding-bottom:8px}.bar-row{display:flex;align-items:center;margin:8px 0}.bar-label{width:120px;font-size:13px}.bar-container{flex:1;background:#f0f0f0;height:24px;border-radius:4px;overflow:hidden}.bar-fill{background:#0066cc;height:100%;display:flex;align-items:center;padding-left:10px;color:white;font-size:12px;font-weight:600}.summary{background:#fff9e6;border-left:4px solid #f5a623;padding:16px;margin-top:30px;border-radius:4px}</style></head><body><h1>Monthly Sales Report</h1><div class='period'>{{period}} — {{company}}</div><div class='kpi-grid'><div class='kpi'><div class='kpi-label'>Revenue</div><div class='kpi-value'>€{{revenue}}</div><div class='kpi-change'>▲ {{revenue_growth}}% vs previous month</div></div><div class='kpi'><div class='kpi-label'>New Customers</div><div class='kpi-value'>{{new_customers}}</div></div><div class='kpi'><div class='kpi-label'>Avg Deal Size</div><div class='kpi-value'>€{{avg_deal}}</div></div></div><h2>Top Products</h2>{{#each top_products}}<div class='bar-row'><div class='bar-label'>{{name}}</div><div class='bar-container'><div class='bar-fill' style='width:{{percent}}%'>€{{revenue}}</div></div></div>{{/each}}<h2>Revenue by Region</h2>{{#each regions}}<div class='bar-row'><div class='bar-label'>{{name}}</div><div class='bar-container'><div class='bar-fill' style='width:{{percent}}%;background:{{color}}'>{{percent}}%</div></div></div>{{/each}}<div class='summary'><strong>Summary:</strong> {{summary}}</div></body></html>",
    "data": {
      "period": "March 2026",
      "company": "Your Company",
      "revenue": "142,500",
      "revenue_growth": 18,
      "new_customers": 47,
      "avg_deal": "3,032",
      "top_products": [
        { "name": "Pro Plan",    "revenue": "82,000", "percent": 100 },
        { "name": "Team Plan",   "revenue": "38,000", "percent": 46 },
        { "name": "Enterprise",  "revenue": "22,000", "percent": 27 }
      ],
      "regions": [
        { "name": "Spain",   "percent": 45, "color": "#0066cc" },
        { "name": "France",  "percent": 28, "color": "#00a86b" },
        { "name": "Germany", "percent": 18, "color": "#f5a623" },
        { "name": "Other",   "percent":  9, "color": "#888888" }
      ],
      "summary": "March delivered our strongest month of the quarter, with 18% revenue growth driven by continued expansion of the Pro Plan. Spain and France combined now represent 73% of total revenue, suggesting the localization investment is paying off. Customer acquisition stayed steady at ~47/month."
    },
    "paper_size": "A4",
    "filename": "sales-report-2026-03.pdf"
  }
}
```

## Tips

- **Horizontal bars instead of real charts**: you can fake chart visualizations with styled `<div>` bars using standard CSS. For real SVG charts, include them inline in the markup.
- **Brand it**: add your logo as a base64-encoded `<img>` at the top, or upload it once via the rendoc dashboard and reference it.
- **Automate monthly**: schedule a cron job that prompts Claude (or uses the rendoc API directly) with the month's data to auto-generate every month's report on the 1st.
