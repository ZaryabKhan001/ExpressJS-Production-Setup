# Express Production

A small example Express + TypeScript API demonstrating standard patterns for features, validation, authentication, and tests.

## Table of contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Database & Prisma](#database--prisma)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Common issues & troubleshooting](#common-issues--troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This repository implements an API using Express, TypeScript, Prisma (Postgres), Zod for validation, and Vitest for tests. Authentication is implemented with JWTs stored in HttpOnly cookies. Tests are written to be fast and isolated; factories and test helpers are used for DB setup/cleanup.

## Prerequisites

- Node.js (>= 18)
- npm
- A Postgres database for development (or set `DATABASE_URL` to a test database)

## Quick start

1. Install dependencies

```bash
npm install
```

2. Copy environment (example)

- Create `.env` and `.env.test` (used by tests) files and set the following (at minimum):

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET=your_jwt_secret
```

3. Run database migrations (or push schema)

```bash
# Generate Prisma client
npx prisma generate
# Apply migrations in development
npx prisma migrate dev --name init
# (or push schema)
npx prisma db push
```

4. Start in development

```bash
npm run dev
```

5. Build and run

```bash
npm run build
npm start
```

## Database & Prisma

- Prisma schema is in `prisma/schema.prisma`.
- Generated client is under `generated/prisma` (do not edit).
- Seed script (if present) can be run via `npm run prisma:seed`.

Useful scripts from package.json:

- `npm run prisma:deploy` — run migrations & generate client
- `npm run prisma:migrate` — create a new migration
- `npm run prisma:push` — push schema to database
- `npm run prisma:studio` — open Prisma Studio

## Testing

Run the full test suite with:

```bash
npm test
# or
npx vitest run
```

Tips:
- Use `.env.test` to point to a dedicated test DB. The test suite cleans up users it creates, but using a dedicated test DB prevents collisions.
- Tests may generate unique data (e.g., `createId()` + `@example.com`) to avoid conflicts and make tests idempotent.

## Project structure

Top-level layout (key folders):

- `src/`
  - `app.ts` — application factory (used by tests)
  - `server.ts` — server bootstrap
  - `routes.ts` — router registration
  - `features/` — feature modules (authentication, user profile, etc.)
  - `middlewares/` — shared middlewares (validation, auth, etc.)
  - `utils/` — helpers and shared utilities (async handler, error helpers)
- `prisma/` — Prisma schema and seeds
- `generated/` — generated Prisma client (committed for convenience)

## Common issues & troubleshooting

- Validation responses unexpectedly returned 500 errors: ensure your validation middleware catches `ZodError` correctly and returns a 400 with normalized error messages (tests expect `message: 'Required'` for missing fields).
- Registration test failing with `409 Conflict`: tests should use unique emails or ensure cleanup runs to avoid collisions (use factory functions or randomize addresses).
- If tests behave nondeterministically, re-check `.env.test` and confirm you are using a dedicated test DB.

## Contributing

- Add tests for new behavior and ensure all tests pass locally.
- Keep changes small and focused. Run `npm test` before submitting a PR.

## License

MIT — see LICENSE file for details.

---

If you'd like, I can:
- Expand this README with API endpoint examples (request/response snippets),
- Add a CONTRIBUTING.md, or
- Create a quick CD/CI checklist for running migrations and tests in CI.

Tell me which you'd like next.