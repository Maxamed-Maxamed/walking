---
description: "Use when working on the DogWalker Expo React Native mobile app — covers architecture, Supabase backend, NativeWind UI, Stripe payments, auth, role-based navigation, and CI/CD conventions."
applyTo: "**/*.{ts,tsx,sql,yml,yaml}"
---

# DogWalker Project Instructions

## Project Overview

DogWalker is a two-sided marketplace mobile app connecting **Dog Owners** (who need walks) with **Dog Walkers** (who offer walking services). Built with Expo React Native (TypeScript), Supabase backend, NativeWind styling, and Stripe payments.

### MVP Scope (v1)

- Email/password auth with role selection (owner | walker)
- Owner: add dogs, browse walkers, request/book walks, chat, pay, review
- Walker: set profile & availability, receive/accept/decline requests, earn money
- In-app messaging between matched owner-walker pairs
- Stripe payment (owner pays) and payout (walker earns)

### Deferred (post-MVP)

- Live GPS tracking during walks, advanced analytics, complex rating algorithms, push notification campaigns, social login (Google/Apple), multi-currency support

---

## Tech Stack

| Layer        | Technology                                                                          |
| ------------ | ----------------------------------------------------------------------------------- |
| Framework    | Expo SDK 54+, React Native 0.81+, TypeScript (strict)                               |
| Routing      | **Expo Router** (file-based, typed routes enabled)                                  |
| Server state | **TanStack Query (React Query)** for all Supabase data fetching, caching, mutations |
| Client state | Minimal — colocate in components; use React Context only for auth/session           |
| Backend      | **Supabase** (Postgres, Auth, Realtime, Edge Functions, Storage)                    |
| Styling      | **NativeWind v4** (Tailwind CSS for React Native) — use `className` prop            |
| Payments     | **Stripe** (Connect marketplace model) via Supabase Edge Functions                  |
| CI/CD        | **GitHub Actions** with dev / staging / production environments                     |

---

## Architecture Rules

### File & Folder Structure

```
src/
  app/                    # Expo Router file-based routes
    _layout.tsx           # Root layout: providers, auth gate
    (auth)/               # Auth group: login, signup, role-select
    (owner)/              # Owner tab group
      (tabs)/
        _layout.tsx
        index.tsx         # Home / browse walkers
        my-dogs.tsx
        bookings.tsx
        messages.tsx
        profile.tsx
    (walker)/             # Walker tab group
      (tabs)/
        _layout.tsx
        jobs.tsx
        schedule.tsx
        messages.tsx
        earnings.tsx
        profile.tsx
  components/
    ui/                   # Design system primitives (Button, Card, TextInput, Badge, Avatar)
    owners/               # Owner-specific composed components
    walkers/              # Walker-specific composed components
  lib/
    supabase.ts           # Supabase client singleton
    stripe.ts             # Stripe helpers
    api/                  # TanStack Query hooks per domain (useWalkers, useBookings, etc.)
  hooks/                  # Shared custom hooks
  constants/              # Theme, config, enums
  types/                  # Shared TypeScript types & Supabase generated types
```

### Conventions

- Use **path alias** `@/` mapped to the project root (already configured in tsconfig).
- One component per file; filename uses **kebab-case** (e.g., `primary-button.tsx`).
- Screens live under `app/` following Expo Router conventions; shared components under `components/`.
- Co-locate TanStack Query hooks in `lib/api/` — one file per domain entity (e.g., `lib/api/bookings.ts`).
- Export types from `types/` — generate Supabase types with `supabase gen types typescript`.
- **No default exports** except for Expo Router screen/layout components (which require them).
- Prefer **named functions** over arrow functions for component declarations.

---

## Auth & Role-Based Access

### Auth Flow

1. User signs up with email/password via Supabase Auth.
2. On signup, user selects **one or both roles**: `"owner"`, `"walker"`, or both.
3. A `profiles` row is created (via Supabase trigger or client call).
4. Roles stored in a **`user_roles` join table** (`user_id`, `role`) — a user can hold both roles simultaneously.
5. Active role is tracked client-side (user can switch between owner/walker views).
6. Root `_layout.tsx` listens to `supabase.auth.onAuthStateChange` — redirects to `(auth)/` if unauthenticated, shows role-appropriate navigator based on active role.

### Role Gating

- Use an `AuthProvider` context that exposes `session`, `profile`, `roles[]`, `activeRole`, `switchRole()`, `isLoading`.
- Route groups `(owner)` and `(walker)` are protected — redirect if active role doesn't match.
- Users with both roles see a **role switcher** in their profile/settings.
- Never trust client-side role checks alone; always enforce via Supabase RLS on the backend.

---

## Supabase Data Model

### Core Tables

| Table             | Purpose                                                                        |
| ----------------- | ------------------------------------------------------------------------------ |
| `profiles`        | Extends `auth.users` — stores display name, avatar, bio, location              |
| `user_roles`      | Join table — `user_id` + `role` (owner/walker); supports dual-role accounts    |
| `dogs`            | Owner's dogs — name, breed, size, age, special needs, photo                    |
| `walker_profiles` | Walker-specific info — rate per walk, bio, experience, availability JSON       |
| `bookings`        | Walk requests — owner, walker, dog(s), datetime, duration, status, price       |
| `messages`        | Chat messages — sender, receiver, booking ref, body, timestamp                 |
| `payments`        | Stripe payment records — booking ref, amount, status, stripe_payment_intent_id |
| `reviews`         | Post-walk reviews — booking ref, reviewer, rating (1-5), comment               |

### Key Patterns

- All tables have `id UUID DEFAULT gen_random_uuid()`, `created_at TIMESTAMPTZ DEFAULT now()`, `updated_at TIMESTAMPTZ DEFAULT now()`.
- Foreign keys reference `auth.users(id)` for user-owned data.
- Booking statuses follow enum: `pending → confirmed → in_progress → completed → cancelled`.
- Payment statuses: `pending → succeeded → failed → refunded`.
- **Multi-currency**: store `currency` (ISO 4217 code, e.g., `"USD"`, `"EUR"`) on `bookings` and `payments`. Default fallback: `"USD"`.
- Use Supabase **Realtime** for the `messages` table to enable live chat — subscribe per booking/thread.
- Chat: `messages` table with `booking_id`, `sender_id`, `body`, `created_at`; subscribe via `supabase.channel('messages:booking_id=eq.{id}')`.

### Row Level Security (RLS)

- **Always enable RLS** on every table.
- Owners read/write only their own dogs, bookings, reviews.
- Walkers read only bookings assigned to them; cannot see other walkers' bookings.
- `user_roles`: users can only read/insert their own roles; no deleting roles (admin only).
- Messages: both sender and receiver can read; only sender can insert.
- Payments: read-only for both parties in the booking; mutations via Edge Functions only.

---

## NativeWind / UI Design System

### Color Tokens

```
primary: #4F46E5 (indigo-600)     secondary: #10B981 (emerald-500)
background: #FFFFFF / #0F172A     surface: #F8FAFC / #1E293B
error: #EF4444                    warning: #F59E0B
success: #22C55E                  muted: #94A3B8
```

### Component Rules

- **All styling via `className`** — no `StyleSheet.create` unless NativeWind can't handle it.
- Reusable UI components accept `className` prop for composition (merge with `twMerge`/`clsx`).
- Design system primitives live in `components/ui/`: `Button`, `TextInput`, `Card`, `Badge`, `Avatar`.
- Button variants: `primary`, `secondary`, `outline`, `destructive`, `ghost`.
- Cards use `rounded-2xl p-4 bg-surface shadow-sm` as base.
- Use spacing scale consistently: `gap-2` (8px), `gap-4` (16px), `gap-6` (24px).

---

## Stripe Payments

### Architecture

- **Marketplace model** with Stripe Connect: owners pay, walkers receive payouts.
- Payment flow: booking confirmed → Supabase Edge Function creates `PaymentIntent` → owner pays in-app via Stripe SDK → webhook confirms → booking status updates.
- All Stripe server-side logic lives in **Supabase Edge Functions** (Deno/TypeScript).
- Never expose `STRIPE_SECRET_KEY` client-side — only `STRIPE_PUBLISHABLE_KEY`.
- Store `stripe_customer_id` on owner profile, `stripe_account_id` on walker profile.

### Environment Variables (placeholders only)

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=          # Edge Functions only
STRIPE_WEBHOOK_SECRET=      # Edge Functions only
```

---

## TanStack Query Patterns

- Wrap app in `QueryClientProvider` in root `_layout.tsx`.
- Query keys: `[entity, ...params]` — e.g., `['bookings', { status: 'pending' }]`.
- Custom hooks per domain: `useWalkers()`, `useBooking(id)`, `useCreateBooking()`.
- Use `useMutation` for writes; invalidate related queries on success.
- Supabase client is the data layer inside query/mutation functions — no extra API abstraction.
- Enable `refetchOnWindowFocus` and `staleTime: 5 * 60 * 1000` (5 min) as defaults.

---

## CI/CD & Environments

### Branching Model

- `main` → production, `develop` → staging, feature branches → PRs against `develop`.

### GitHub Actions

- **ci.yml**: on PRs — install, TypeScript check (`tsc --noEmit`), ESLint, tests (Jest + React Native Testing Library).
- **build.yml**: on push to `main`/`develop` — Expo Application Services (EAS) build, output artifacts.
- Secrets per environment: `SUPABASE_URL_DEV`, `SUPABASE_URL_STAGING`, `SUPABASE_URL_PROD`, etc.
- Branch protection: require passing CI + 1 approval before merge to `develop`/`main`.

### Testing

- **Unit / Integration**: Jest + React Native Testing Library (RNTL).
- **E2E**: Detox for critical user flows (signup, booking, payment).
- Test files colocated: `__tests__/` folders next to source, or `*.test.tsx` beside the component.
- CI runs unit tests on every PR; E2E runs on push to `develop`/`main`.
- Minimum coverage target: 70% for `lib/` and `hooks/`.

### Code Quality

- ESLint with `eslint-config-expo` (already configured).
- TypeScript strict mode enabled.
- Prefer small, focused PRs over large monolithic ones.
