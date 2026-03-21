# AGENTS.md

## Build & Test Commands

1. **Start Dev Server**: `npm run start` (Expo start)
2. **Lint Code**: `npm run lint` (Expo lint)
3. **Reset Project**: `npm run reset-project` (node ./scripts/reset-project.js)
4. **Run on Android**: `npm run android` (Expo start --android)
5. **Run on iOS**: `npm run ios` (Expo start --ios)
6. **Run on Web**: `npm run web` (Expo start --web)
7. **Type Check**: `npx tsc --noEmit` (TypeScript check)
8. **Format Code**: `npx prettier --write .` (Prettier formatting)
9. **Run Tests**: `npm test` (Jest) - Configured with Jest and React Native Testing Library
10. **Run Single Test**: `npm test -- --testNamePattern="<test_name>"` or `npm test -- --testPathPattern="<test_file>"`

## Code Style Guidelines

### Imports

- Use absolute imports for external libraries (e.g., `import React from 'react'`).
- Use relative imports for internal files (e.g., `import { Header } from '../components/Header'`).
- Group imports: external libraries first, then internal components/utils, then styles.
- Use **path alias** `@/` mapped to the project root (configured in tsconfig).

### Formatting

- Use **Prettier** for code formatting.
- Run `npx prettier --write .` to format the codebase.
- Indent with 2 spaces.
- Single quotes for strings unless embedding quotes.

### Types (TypeScript)

- Use explicit types for function parameters and return values.
- Avoid `any`; use interfaces or type aliases.
- Use `interface` for object shapes, `type` for unions/intersections.
- TypeScript strict mode enabled.

### Naming Conventions

- **Variables/Functions**: camelCase (e.g., `fetchUser`, `userCount`).
- **Components**: PascalCase (e.g., `UserProfile`, `LoginButton`).
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`, `API_URL`).
- **Files**: kebab-case (e.g., `user-profile.tsx`, `api-utils.ts`).
- One component per file; filename uses **kebab-case**.

### Error Handling

- Use try-catch for async operations.
- Return typed errors or use error boundaries in React.
- Log errors to console or external service (e.g., Sentry).

### React Components

- Use functional components with hooks.
- Keep components small and focused.
- Use TypeScript interfaces for props.
- **No default exports** except for Expo Router screen/layout components.
- Prefer **named functions** over arrow functions for component declarations.

### Git

- Commit messages follow Conventional Commits (e.g., `feat: add login form`).
- Branch naming: `feature/<name>`, `bugfix/<name>`.
- Use descriptive commit messages.

### Other

- No console.log in production code.
- Document complex logic with JSDoc comments.
- Follow existing patterns in the codebase.
- Prefer small, focused PRs over large monolithic ones.

## Cursor & Copilot Rules

### Cursor Rules

- If `.cursor/rules` or `.cursorrules` exists, follow those rules.
- **Codacy Rules** (from `.cursor/rules/codacy.mdc`):
  - After ANY successful `edit_file` or `reapply` operation, run `codacy_cli_analyze` for the edited file.
  - If Codacy CLI is not installed, ask user if they want it installed.
  - After dependency operations, run `codacy_cli_analyze` with tool "trivy".
  - If vulnerabilities are found, stop and fix them before continuing.

### Copilot Instructions

- If `.github/copilot-instructions.md` exists, follow those instructions.
- **DogWalker App Specifics**:
  - Tech Stack: Expo SDK 55+, React Native 0.81+, TypeScript (strict), Expo Router, TanStack Query, Supabase, NativeWind v4, Stripe.
  - File Structure:
    - `app/` for routes (Expo Router)
    - `components/ui/` for design system primitives
    - `components/owners/` and `components/walkers/` for role-specific components
    - `lib/` for utilities (Supabase client, Stripe helpers, TanStack Query hooks)
    - `hooks/` for shared custom hooks
    - `constants/` for theme, config, enums
    - `types/` for shared TypeScript types
  - Auth: Email/password with role selection (owner/walker), stored in `user_roles` join table.
  - Supabase: RLS enabled on all tables, Realtime for messages.
  - NativeWind: All styling via `className`, design system in `components/ui/`.
  - Stripe: Marketplace model with Connect, server-side logic in Supabase Edge Functions.
  - TanStack Query: Wrap app in `QueryClientProvider`, custom hooks per domain.

## Project Specifics

### Auth & Role-Based Access

- User signs up with email/password via Supabase Auth.
- On signup, user selects **one or both roles**: `"owner"`, `"walker"`, or both.
- Roles stored in a **`user_roles` join table** (`user_id`, `role`).
- Root `_layout.tsx` handles auth state changes and redirects.
- Active role is tracked client-side (user can switch between owner/walker views).
- Route groups `(owner)` and `(walker)` are protected — redirect if active role doesn't match.
- Users with both roles see a **role switcher** in their profile/settings.
- Never trust client-side role checks alone; always enforce via Supabase RLS on the backend.
- Use an `AuthProvider` context that exposes `session`, `profile`, `roles[]`, `activeRole`, `switchRole()`, `isLoading`.

### Supabase Data Model

- **Core Tables**:
  - `profiles`: Extends `auth.users` — stores display name, avatar, bio, location
  - `user_roles`: Join table — `user_id` + `role` (owner/walker); supports dual-role accounts
  - `dogs`: Owner's dogs — name, breed, size, age, special needs, photo
  - `walker_profiles`: Walker-specific info — rate per walk, bio, experience, availability JSON
  - `bookings`: Walk requests — owner, walker, dog(s), datetime, duration, status, price
  - `messages`: Chat messages — sender, receiver, booking ref, body, timestamp
  - `payments`: Stripe payment records — booking ref, amount, status, stripe_payment_intent_id
  - `reviews`: Post-walk reviews — booking ref, reviewer, rating (1-5), comment
- **Key Patterns**:
  - All tables have `id UUID DEFAULT gen_random_uuid()`, `created_at TIMESTAMPTZ DEFAULT now()`, `updated_at TIMESTAMPTZ DEFAULT now()`.
  - Foreign keys reference `auth.users(id)` for user-owned data.
  - Booking statuses follow enum: `pending → confirmed → in_progress → completed → cancelled`.
  - Payment statuses: `pending → succeeded → failed → refunded`.
  - Multi-currency: store `currency` (ISO 4217 code, e.g., `"USD"`, `"EUR"`) on `bookings` and `payments`. Default fallback: `"USD"`.
  - Use Supabase **Realtime** for the `messages` table to enable live chat — subscribe per booking/thread.
- **Row Level Security (RLS)**:
  - Always enable RLS on every table.
  - Owners read/write only their own dogs, bookings, reviews.
  - Walkers read only bookings assigned to them; cannot see other walkers' bookings.
  - `user_roles`: users can only read/insert their own roles; no deleting roles (admin only).
  - Messages: both sender and receiver can read; only sender can insert.
  - Payments: read-only for both parties in the booking; mutations via Edge Functions only.

### UI & Styling

- **NativeWind v4**: All styling via `className`.
- **Design System**: Primitives in `components/ui/` (Button, Card, TextInput, Badge, Avatar).
- **Color Tokens**:
  - Primary: #4F46E5 (indigo-600)
  - Secondary: #10B981 (emerald-500)
  - Background: #FFFFFF / #0F172A
  - Surface: #F8FAFC / #1E293B
  - Error: #EF4444
  - Warning: #F59E0B
  - Success: #22C55E
  - Muted: #94A3B8
- **Component Rules**:
  - All styling via `className` — no `StyleSheet.create` unless NativeWind can't handle it.
  - Reusable UI components accept `className` prop for composition (merge with `twMerge`/`clsx`).
  - Button variants: `primary`, `secondary`, `outline`, `destructive`, `ghost`.
  - Cards use `rounded-2xl p-4 bg-surface shadow-sm` as base.
  - Use spacing scale consistently: `gap-2` (8px), `gap-4` (16px), `gap-6` (24px).

### Splash Screen Implementation

- Expo Splash Screen is configured in app.json with splash-icon.png
- To customize: modify app.json plugins section under "expo-splash-screen"
- For dynamic splash screens, create a dedicated splash screen component
- Use `expo-splash-screen` API to hide splash screen after async operations complete
- Example: Import SplashScreen from 'expo-splash-screen' and call SplashScreen.hideAsync()
- The project already has a splash screen component at `components/splash-screen.tsx`

### CI/CD

- GitHub Actions for CI (TypeScript, Lint, Tests) and EAS builds.
- Branching: `main` (prod), `develop` (staging), feature branches.
- Secrets per environment: `SUPABASE_URL_DEV`, `SUPABASE_URL_STAGING`, `SUPABASE_URL_PROD`, etc.
- Branch protection: require passing CI + 1 approval before merge to `develop`/`main`.

### TanStack Query Patterns

- Wrap app in `QueryClientProvider` in root `_layout.tsx`.
- Query keys: `[entity, ...params]` — e.g., `['bookings', { status: 'pending' }]`.
- Custom hooks per domain: `useWalkers()`, `useBooking(id)`, `useCreateBooking()`.
- Use `useMutation` for writes; invalidate related queries on success.
- Supabase client is the data layer inside query/mutation functions — no extra API abstraction.
- Enable `refetchOnWindowFocus` and `staleTime: 5 * 60 * 1000` (5 min) as defaults.

### Stripe Payments

- **Marketplace model** with Stripe Connect: owners pay, walkers receive payouts.
- Payment flow: booking confirmed → Supabase Edge Function creates `PaymentIntent` → owner pays in-app via Stripe SDK → webhook confirms → booking status updates.
- All Stripe server-side logic lives in **Supabase Edge Functions** (Deno/TypeScript).
- Never expose `STRIPE_SECRET_KEY` client-side — only `STRIPE_PUBLISHABLE_KEY`.
- Store `stripe_customer_id` on owner profile, `stripe_account_id` on walker profile.

### Testing

- **Unit / Integration**: Jest + React Native Testing Library (RNTL).
- **E2E**: Detox for critical user flows (signup, booking, payment).
- Test files colocated: `__tests__/` folders next to source, or `*.test.tsx` beside the component.
- CI runs unit tests on every PR; E2E runs on push to `develop`/`main`.
- Minimum coverage target: 70% for `lib/` and `hooks/`.

### Environment Variables

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY` (Edge Functions only)
- `STRIPE_WEBHOOK_SECRET` (Edge Functions only)

### Code Quality

- ESLint with `eslint-config-expo` (already configured).
- TypeScript strict mode enabled.
- Prefer small, focused PRs over large monolithic ones.
- Use descriptive commit messages (e.g., `feat: add booking cancellation flow`).
- Use semantic versioning (e.g., `v1.0.0`).

## Summary

This guide ensures agents follow the project's specific conventions, from build commands to complex Supabase/Stripe integrations.
