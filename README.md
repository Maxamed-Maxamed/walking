# DogWalker

> Status: Pre-MVP, active development.

DogWalker is an Expo + React Native mobile app in active development for connecting dog owners with dog walkers. This repository already includes the mobile app shell, branded splash flow, Supabase client wiring, and dog profile data hooks, while the broader marketplace experience is still being built.

## App Preview

Screenshots and flow previews will be added once the owner and walker journeys move beyond the current placeholder app shell.

## Current Status

What exists in this repo today:

- Expo Router app shell with a root layout, provider wiring, and a placeholder home screen
- Query client setup with five-minute stale time and window-focus refetching
- Custom splash flow with branded assets and minimum display timing
- Supabase client configuration with persisted auth sessions
- Dog data hooks for listing, creating, updating, deleting, and uploading dog photos
- Supabase migrations for storage setup
- Jest configuration with a basic test harness

What is planned but not fully implemented in the current route tree:

- Owner and walker dashboards
- Full authentication and role-switching flow
- Booking lifecycle
- Messaging
- Payments and payouts
- Reviews

## Known Gaps

- The current routed app surface is still a placeholder home screen.
- `lib/auth-context.tsx` is a scaffold, not a production auth flow.
- Booking, messaging, reviews, and payments are product roadmap items, not completed features in the current codebase.

## Tech Stack

- Expo SDK 55
- React Native 0.83
- React 19
- TypeScript
- Expo Router
- TanStack Query
- Supabase
- NativeWind v4
- Expo Image Picker, Camera, Asset, Font, Secure Store, Splash Screen, and Web Browser
- Jest with `jest-expo`

## Project Structure

```text
app/
  _layout.tsx          Root providers, splash handling, route stack
  index.tsx            Current placeholder landing screen
components/
  splash-screen.tsx    Branded splash UI
  ui/                  Shared UI primitives
lib/
  supabase.ts          Supabase client setup
  auth-context.tsx     Auth context scaffold
  api/dogs.ts          Dog CRUD + photo upload hooks
supabase/
  migrations/          SQL migrations for backend/storage setup
assets/
  images/              App icons, logos, splash assets
test/
  setup.test.js        Basic Jest smoke test
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in the client-safe values:

```bash
cp .env.example .env.local
```

Expected variables:

```bash
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-publishable-key
```

3. Start the app:

```bash
npm run start
```

4. Open it on a target platform:

```bash
npm run android
npm run ios
npm run web
```

## Available Commands

- `npm run start` - Start the Expo dev server
- `npm run android` - Launch the Expo flow for Android
- `npm run ios` - Launch the Expo flow for iOS
- `npm run web` - Run the app in a web browser
- `npm run lint` - Run Expo/ESLint checks
- `npm run reset-project` - Reset the starter structure using the included script
- `npx tsc --noEmit` - Run TypeScript type-checking
- `npm test` - Run the Jest test suite

## Security Notes

- Only `EXPO_PUBLIC_*` values belong in the Expo app configuration.
- Stripe secret keys, webhook secrets, and any backend credentials must stay in server-side secret stores, never in the mobile app bundle.
- See [SECURITY.md](./SECURITY.md) for private vulnerability reporting and repository security expectations.

## CI

This repository currently includes the following GitHub Actions workflows:

- `ci.yml` for lint, TypeScript checks, and Jest tests on `main` and `develop`
- `codeql.yml` for scheduled and branch-based CodeQL scanning
- `dependency-review.yml` for pull request dependency review
- `codacy.yml` for Codacy security scanning

## Supabase Notes

The connected Supabase project currently reports:

- A `dog-photos` storage bucket
- Two tracked migrations: `20260312225200_new-migration` and `20260312225302_dog-photos-storage`
- Public dog photo access with authenticated owner-folder write policies defined in the storage migration

The dog photo bucket is configured for:

- Public reads
- Owner-scoped writes by folder name
- `image/jpeg`, `image/png`, and `image/webp`
- A 5 MB per-file bucket limit in the storage migration

## Development Notes

- The root route is currently a simple welcome screen while the broader app experience is still being assembled.
- `lib/auth-context.tsx` is currently a scaffold, not a full auth implementation.
- `lib/supabase.ts` is already wired for mobile session persistence with AsyncStorage.
- `lib/api/dogs.ts` is the most complete domain module in the repo today.

## Roadmap

Short-term priorities for this project are:

1. Finish the authentication and onboarding flow.
2. Build owner-side dog management screens on top of the existing dog hooks.
3. Add walker profiles and booking flows.
4. Introduce chat, payments, and review workflows.
5. Tighten tests, route protection, and production readiness.

## Branching and Releases

- `main` is the production-facing branch.
- `develop` is the staging and integration branch.
- Feature work should land through focused pull requests from feature branches.
- Release history is tracked in [CHANGELOG.md](./CHANGELOG.md).

## Project Policies

- License: [MIT](./LICENSE.md)
- Security policy: [SECURITY.md](./SECURITY.md)
- Code of conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Contributing guide: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Additional Docs

- Architecture: [docs/architecture.md](./docs/architecture.md)
- Backend: [docs/backend.md](./docs/backend.md)
- Testing: [docs/testing.md](./docs/testing.md)

## Reference

- Expo config: `app.json`
- App entry and providers: `app/_layout.tsx`
- Supabase client: `lib/supabase.ts`
- Dog domain hooks: `lib/api/dogs.ts`
- Backend migrations: `supabase/migrations/`
