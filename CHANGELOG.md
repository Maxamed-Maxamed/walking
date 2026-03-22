# Changelog

All notable changes to this project should be documented in this file.

The format is based on Keep a Changelog and the project follows semantic
versioning where practical.

## [Unreleased]

### Added

- Project-specific `README.md`
- MIT license, security policy, contributing guide, and code of conduct
- GitHub issue templates and pull request template
- `CODEOWNERS`
- Basic CI workflow for lint and TypeScript checks
- Additional architecture, backend, and testing documentation
- Direct Jest toolchain dependencies and `npm test`

### Changed

- Supabase client env variable naming normalized to `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Setup docs updated to reference `.env.example`
- CI now runs Jest tests alongside lint and type-checking
