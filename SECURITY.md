# Security Policy

## Supported Branches

DogWalker is still in active development, so support is tracked by branch rather
than by release line.

| Branch | Support Status |
| --- | --- |
| `main` | Active security support |
| `develop` | Best-effort support |
| Feature branches | Not supported |

## Reporting a Vulnerability

Please do not open public GitHub issues for security vulnerabilities.

Report suspected vulnerabilities privately by emailing
`Maxamed.Maxamed0079@gmail.com` with:

- A short description of the issue
- Steps to reproduce it
- The affected file, route, workflow, or feature area
- Any proof-of-concept, logs, or screenshots that help confirm impact
- Your assessment of severity and potential user impact

Best-effort response targets:

- Initial acknowledgement within 5 business days
- Triage and next-step guidance after review
- Coordinated disclosure after a fix is ready

## Security Expectations for Contributors

- Never commit secrets, tokens, API keys, certificates, or `.env` files.
- Treat anything in `EXPO_PUBLIC_*` as client-visible and non-secret.
- Keep server-only secrets such as Stripe secret keys in secure backend or CI
  secret stores only.
- Use private reporting for vulnerabilities instead of public issues or pull
  requests.
- Rotate any credential immediately if it is exposed in source control,
  screenshots, logs, or configuration files.

## Current Security Tooling

This repository already includes automated security checks in
`.github/workflows/`:

- `codeql.yml` for GitHub CodeQL analysis on pushes and pull requests to
  `main`, plus a scheduled scan
- `dependency-review.yml` for pull request dependency review on `main`
- `codacy.yml` for Codacy security scanning on pushes and pull requests to
  `main`, plus a scheduled scan

## Scope Notes

Security fixes may involve Expo client code, Supabase configuration, storage
policies, CI workflows, or future edge-function logic. If you are unsure whether
something is security-sensitive, report it privately first.
