# Backend

## Overview

DogWalker uses Supabase as the backend platform. In the current repository
state, the backend surface already includes database migrations and storage
configuration for dog photos.

## Current Supabase Usage

- Supabase JS client in `lib/supabase.ts`
- Postgres-backed application data access through domain hooks
- Storage bucket support for dog photos
- Planned auth, role-based access, and additional domain tables

## Environment Variables

Client-side variables currently expected by the app:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Optional client-side Stripe variable:

```bash
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Server-only secrets must never be embedded in the Expo client.

## Current Migrations

The repository includes:

- `20260312225200_new-migration`
- `20260312225302_dog-photos-storage`

## Storage

The current project setup includes a `dog-photos` bucket with:

- Public read access
- Owner-scoped write policies by folder path
- Allowed mime types for JPEG, PNG, and WebP
- A 5 MB file size limit at the bucket policy level

## Intended Backend Domains

- `profiles`
- `user_roles`
- `dogs`
- `walker_profiles`
- `bookings`
- `messages`
- `payments`
- `reviews`

## Security Expectations

- Enable and maintain RLS for every application table
- Restrict write access using authenticated ownership checks
- Keep server secrets in backend or CI secret stores only
- Use edge functions for privileged Stripe operations

## Next Backend Priorities

1. Finalize the auth and role model in code and schema.
2. Add booking-related data access and policies.
3. Add messaging and review support.
4. Add edge-function-backed payment workflows.
