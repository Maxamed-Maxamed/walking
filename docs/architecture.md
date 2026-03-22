# Architecture

## Overview

DogWalker is structured as an Expo Router mobile client backed by Supabase. The
current repository is still early-stage, but the intended architecture is
already visible in the layout, data hooks, and backend migrations.

## Core Layers

### Mobile Client

- Expo SDK 55+ app using React Native and TypeScript
- Expo Router for file-based navigation
- NativeWind for styling
- TanStack Query for server-state caching and mutation flows

### Data and Auth

- Supabase Auth for session management
- Supabase Postgres for application data
- Supabase Storage for dog photo uploads
- Supabase RLS for data isolation

### Current Client Structure

- `app/_layout.tsx` wires providers, splash behavior, and the route stack
- `lib/supabase.ts` creates the shared Supabase client
- `lib/api/dogs.ts` contains the most complete domain data hooks in the repo
- `lib/auth-context.tsx` defines the shape of auth state but is still scaffolded

## Intended Product Domains

- Authentication and onboarding
- Owner dog management
- Walker profiles
- Booking and scheduling
- Messaging
- Reviews
- Payments and payouts

## Data Flow

1. The Expo app boots through `app/_layout.tsx`.
2. Shared providers initialize query state, auth state, splash behavior, and safe area handling.
3. Feature modules call Supabase through domain hooks in `lib/api/`.
4. Supabase Auth and RLS constrain what each user can access.
5. Storage is used for dog photo uploads and public reads where configured.

## Current Risks and Constraints

- Route coverage is still minimal, so architecture is ahead of UI implementation.
- The auth context shape exists, but the full role-based flow is not complete.
- Tests are partially scaffolded, but the direct Jest toolchain still needs final setup verification.
- Payments and messaging are planned but not yet represented by working app flows.

## Near-Term Architectural Priorities

1. Complete onboarding and role-aware auth routing.
2. Add owner-facing screens on top of the existing dog hooks.
3. Expand domain hooks for walker profiles and bookings.
4. Introduce stronger test coverage for hooks and route flows.
