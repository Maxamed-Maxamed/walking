# Contributing

Thanks for contributing to DogWalker.

## Before You Start

- Read [README.md](./README.md) for the current project status and setup steps.
- Read [SECURITY.md](./SECURITY.md) before reporting vulnerabilities.
- Follow [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) in all project spaces.
- Keep changes focused. Small, reviewable pull requests are preferred over large
  mixed changes.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in the values required by the
current client setup:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run start
```

## Useful Commands

- `npm run lint`
- `npx tsc --noEmit`
- `npm test`
- `npm run android`
- `npm run ios`
- `npm run web`

## Branches and Commits

- Use feature branches such as `feature/<name>` or `bugfix/<name>`.
- Follow Conventional Commits where practical, for example:
  - `feat: add dog profile form`
  - `fix: handle missing Supabase session`
  - `docs: update setup instructions`

## Pull Request Expectations

- Explain what changed and why.
- Include screenshots or short recordings for UI changes when relevant.
- Run linting and type-checking before opening the pull request.
- Update docs when setup, workflows, or behavior changes.
- Do not include unrelated refactors in the same pull request.

## Secrets and Sensitive Data

- Do not commit `.env`, `.env.local`, API keys, tokens, or certificates.
- Assume all `EXPO_PUBLIC_*` values are safe for client exposure only.
- Keep backend secrets in the appropriate secret store, not in the mobile app.

## Need Help?

If you are planning a larger architectural or product change, open an issue or
start a discussion first so the direction is clear before implementation begins.
