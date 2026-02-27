# Playwright Boilerplate - saucedemo

This repository contains a Playwright Test boilerplate showcasing best practices: Page Object Model, environment variables usage, TypeScript, linting, formatting, and CI with GitHub Actions.

Quick start:

```bash
npm install
npm run tests
```

Scripts:

- `npm run tests` — run tests headless
- `npm run lint` — run ESLint
- `npm run format` — format with Prettier

Credentials are read from `.env` (see `TEST_USER` / `TEST_PASS`) and can be overridden by environment variables.

## Authenticated test runs (storageState)

To speed up tests and avoid repeated logins, this project uses Playwright's `storageState` feature.

## Visual regression snapshots

Some tests use Playwright's `toHaveScreenshot()` for visual regression. Baseline snapshots are stored in `tests/*-snapshots/` and should be committed. To update snapshots after intentional UI changes:

```bash
npx playwright test --update-snapshots
```

Copyright (c) 2026 Viktoriia Chykrii.
