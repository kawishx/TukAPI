# TukAPI

Production-style Node.js ES Modules REST API scaffold for Sri Lanka Police tuk-tuk tracking, live location monitoring, and historical movement analytics.

## Tech Stack

- Node.js with JavaScript ES Modules
- Express
- PostgreSQL
- Prisma ORM
- JWT authentication
- Helmet
- CORS
- express-rate-limit
- pino-http
- Zod
- Swagger UI / OpenAPI
- ESLint + Prettier
- Vitest + Supertest

## Project Structure

```text
.
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── eslint.config.js
├── package.json
├── prisma
│   └── schema.prisma
├── scripts
│   └── seed.js
├── src
│   ├── app.js
│   ├── config
│   │   ├── env.js
│   │   ├── logger.js
│   │   ├── prisma.js
│   │   ├── rateLimit.js
│   │   └── swagger.js
│   ├── docs
│   │   └── openapi.yaml
│   ├── middlewares
│   │   ├── asyncHandler.js
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── notFoundHandler.js
│   │   └── validateRequest.js
│   ├── modules
│   │   ├── auth
│   │   ├── devices
│   │   ├── districts
│   │   ├── drivers
│   │   ├── index.js
│   │   ├── locations
│   │   ├── provinces
│   │   ├── stations
│   │   ├── tukTuks
│   │   └── users
│   ├── server.js
│   ├── tests
│   │   └── health.test.js
│   └── utils
│       ├── apiError.js
│       ├── apiResponse.js
│       ├── constants.js
│       ├── httpCache.js
│       ├── pagination.js
│       ├── queryOptions.js
│       ├── sorting.js
│       └── validationSchemas.js
└── vitest.config.js
```

## Architecture Summary

The scaffold follows a modular controller-service-repository pattern for each domain area:

- `controller`: HTTP layer and response formatting
- `service`: business-use-case orchestration
- `repository`: Prisma/database access boundary
- `validation`: Zod request schemas
- `routes`: Express routing and middleware composition

Shared platform concerns are placed in:

- `config/` for environment, logging, Prisma, rate limiting, and Swagger bootstrapping
- `middlewares/` for auth, authorization, validation, async wrapping, and centralized errors
- `utils/` for cache-aware responses, query parsing, constants, and reusable schemas

## API Overview

Base URL:

```text
/api/v1
```

Main resource groups:

- `auth`
- `provinces`
- `districts`
- `stations`
- `tuk-tuks`
- `drivers`
- `devices`
- `locations`
- `users`

Operational endpoints included in the scaffold:

- `GET /api/v1/health`
- `GET /api/v1/health/ready`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- versioned route modules for all requested domains
- `POST /api/v1/locations/pings`
- `GET /api/v1/locations/live/:tukTukId`
- `GET /api/v1/locations/history`
- `GET /docs`
- `GET /docs/openapi.json`

The scaffold includes:

- JWT authentication and role-based authorization middleware
- Prisma PostgreSQL integration with env-based `DATABASE_URL`
- database-aware health checks and a real Prisma-backed provinces repository example
- pagination, sorting, and geographic filtering query scaffolding
- ETag and `Last-Modified` based conditional GET support helpers
- Swagger/OpenAPI documentation setup
- sample health check test with Supertest

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your PostgreSQL connection and JWT secret.

4. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Create and apply the first migration:

   ```bash
   npm run prisma:migrate:dev -- --name init
   ```

6. Optional follow-up Prisma commands:

   ```bash
   npm run prisma:migrate:status
   npm run prisma:seed
   npm run prisma:studio
   ```

7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open Swagger UI:

   ```text
   http://localhost:3000/docs
   ```

## Prisma Workflow

Use these commands during development:

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
npm run prisma:seed
npm run dev
```

For later schema updates:

```bash
npm run prisma:migrate:dev -- --name describe_your_change
```

For checking migration state:

```bash
npm run prisma:migrate:status
```

## Notes

- Most modules remain intentionally scaffolded with TODO-ready placeholders.
- `health` and `provinces` now demonstrate real database integration patterns using Prisma.
- The auth flow is wired structurally, but credential verification and secure password storage should be implemented next.
