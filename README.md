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
│   │   ├── rateLimit.js
│   │   └── swagger.js
│   ├── db
│   │   └── prismaClient.js
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
│       ├── queryOptions.js
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

- `config/` for environment, logging, rate limiting, and Swagger bootstrapping
- `middlewares/` for auth, authorization, validation, async wrapping, and centralized errors
- `utils/` for cache-aware responses, query parsing, constants, and reusable schemas
- `db/` for the Prisma client

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
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- CRUD-style placeholder routes for domain modules
- `POST /api/v1/locations/ping`
- `GET /api/v1/locations/live/:tukTukId`
- `GET /api/v1/locations/history`
- `GET /docs`
- `GET /docs/openapi.json`

The scaffold includes:

- JWT authentication and role-based authorization middleware
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

5. Run migrations when your schema is ready:

   ```bash
   npm run prisma:migrate:dev
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open Swagger UI:

   ```text
   http://localhost:3000/docs
   ```

## Notes

- Business logic is intentionally scaffolded with placeholders and TODO-ready boundaries.
- Prisma models are included as a starting point for relational design and can be refined based on your final project requirements.
- The auth flow is wired structurally, but credential verification and secure password storage should be implemented next.
