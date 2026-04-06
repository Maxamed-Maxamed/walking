# DogWalker Project Context (GEMINI.md)

## Project Overview

DogWalker is a React Native mobile application built with **Expo SDK 55**, designed to connect dog owners with dog walkers. The project is currently in **active pre-MVP development**, featuring a branded splash flow, Supabase integration for auth and storage, and initial domain hooks for dog management.

### Tech Stack

- **Framework:** Expo SDK 55 (React Native 0.83, React 19)
- **Navigation:** Expo Router (File-based)
- **Data Fetching:** TanStack Query (React Query) v5
- **Backend:** Supabase (Auth, Postgres, Storage, Edge Functions)
- **Styling:** NativeWind v4 (Tailwind CSS for React Native)
- **Icons/UI:** Expo Symbols, Ionicons, custom branded assets
- **Testing:** Jest + React Native Testing Library

## Building and Running

1. **Install Dependencies:** `npm install`
2. **Environment Setup:**
   - Copy `.env.example` to `.env.local`
   - Provide `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. **Start Development:**
   - Dev Server: `npm run start`
   - Android: `npm run android`
   - iOS: `npm run ios`
   - Web: `npm run web`
4. **Validation:**
   - Lint: `npm run lint`
   - Type Check: `npx tsc --noEmit`
   - Test: `npm test`
   - Format: `npx prettier --write .`

## Project Structure

- `app/`: Expo Router routes and layouts.
  - `(auth)/`, `(onboarding)/`, `(owner)/`, `(walker)/`: Protected route groups.
- `components/`: UI components.
  - `ui/`: Design system primitives (Button, Card, etc.).
- `lib/`: Core logic and infrastructure.
  - `api/`: Domain-specific hooks (e.g., `dogs.ts`).
  - `supabase.ts`: Client configuration and session persistence.
- `supabase/`: Backend migrations and edge functions.
- `assets/`: Branded images, icons, and fonts.
- `docs/`: In-depth documentation on architecture, backend, and testing.

## Development Conventions

### Coding Standards

- **Naming:**
  - Files: `kebab-case.tsx`
  - Components: `PascalCase` (Named functions preferred)
  - Variables/Functions: `camelCase`
- **Exports:** No default exports except for Expo Router screens/layouts.
- **Imports:**
  - Use `@/` path alias for project root.
  - Grouping: External libs -> Internal utils/components -> Styles.
- **Styling:** Use `className` with NativeWind. Avoid `StyleSheet.create`.

### Architecture Patterns

- **Auth:** Role-based (Owner/Walker) using a `user_roles` join table in Supabase.
- **Data Flow:** Use custom hooks in `lib/api/` that wrap TanStack Query.
- **Supabase RLS:** Every table must have Row Level Security enabled.
- **Stripe:** Marketplace model using Stripe Connect; server-side logic in Supabase Edge Functions.

### Git & Workflow

- **Commits:** Follow Conventional Commits (e.g., `feat:`, `fix:`, `docs:`).
- **Branches:** `feature/<name>` or `bugfix/<name>`.
- **Validation:** Always run lint, type-check, and tests before pushing.

## Known Gaps (WIP)

- Full authentication and role-switching flow is being scaffolded.
- Owner/Walker dashboards are currently placeholders.
- Booking, Messaging, and Payment modules are on the immediate roadmap.
