# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in the rendoc MCP server, please **do not open a public GitHub issue**. Instead, report it privately so we can fix it before disclosure.

### How to report

- **Email**: security@rendoc.dev
- **Subject**: `[Security] rendoc MCP server — <short summary>`

Please include:

1. A clear description of the vulnerability
2. Steps to reproduce (or a proof-of-concept, if possible)
3. The version of `@rendoc/mcp-server` you tested against
4. Your name/handle if you want credit in the fix notes (optional)

### What to expect

- **Acknowledgement**: within 48 hours
- **Initial assessment**: within 5 business days
- **Fix timeline**: depends on severity
  - Critical (remote code execution, auth bypass): patch within 7 days
  - High (sensitive data exposure): patch within 14 days
  - Medium/Low: patch in next regular release

## Scope

This security policy covers the `@rendoc/mcp-server` npm package and its source code in this repository.

For vulnerabilities in the rendoc API itself (`rendoc.dev`), use the same email — we'll route it appropriately.

## Out of scope

- Issues requiring a compromised API key (API keys are per-user secrets; treat them as passwords)
- Social engineering attacks
- Denial of service via quota exhaustion (rendoc enforces rate limits per plan)

## Safe Harbor

We support responsible disclosure. If you follow this policy, we will:

- Not pursue legal action against you
- Work with you to understand and fix the issue
- Publicly credit your discovery once the vulnerability is patched (if you want)

Thank you for helping keep rendoc and its users safe.
