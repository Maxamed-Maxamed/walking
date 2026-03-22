# Testing

## Current State

The repository contains Jest configuration and a basic smoke test. The intended
local test entrypoint is:

```bash
npm test
```

## Current Test Files

- `jest.config.js`
- `test/setup.test.js`

## Intended Test Layers

### Unit and Integration Tests

- Jest
- `jest-expo`
- Future component-level helpers can be added as the UI surface grows

### Suggested Coverage Priorities

- `lib/api/dogs.ts`
- Auth state and role switching logic
- Route guards and onboarding transitions
- Form validation and mutation handling

## Local Quality Commands

```bash
npm run lint
npx tsc --noEmit
npm test
```

## CI Coverage

The repository CI currently enforces:

- Lint
- TypeScript type checking
- Jest test execution

## Next Testing Priorities

1. Add focused tests around the dog hooks and auth flow.
2. Expand coverage as owner and walker features land.
3. Add richer component and integration tests once the route tree is broader.
