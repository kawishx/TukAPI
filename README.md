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
├── APPENDIX_LINKS_TEMPLATE.md
├── DEMO_CHECKLIST.md
├── LIVE_VERIFICATION.md
├── POSTMAN_REQUESTS.md
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── eslint.config.js
├── package.json
├── render.yaml
├── prisma
│   └── schema.prisma
├── scripts
│   ├── exportSimulationData.js
│   ├── generateSimulation.js
│   ├── rebuildDemoData.js
│   ├── resetDemoData.js
│   ├── seed.js
│   ├── simulationCatalog.js
│   └── simulationUtils.js
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
│   │   ├── api.integration.test.js
│   │   ├── health.test.js
│   │   └── helpers
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
- `GET /api/v1/locations/live`
- `GET /api/v1/locations/live/:tukTukId`
- `GET /api/v1/locations/history`
- `GET /api/v1/tuk-tuks/:id/location-history`
- `GET /docs`
- `GET /docs/openapi.json`

The scaffold includes:

- JWT authentication and role-based authorization middleware
- Prisma PostgreSQL integration with env-based `DATABASE_URL`
- database-aware health checks and a real Prisma-backed provinces repository example
- pagination, sorting, and geographic filtering query scaffolding
- ETag and `Last-Modified` based conditional GET support helpers
- Swagger/OpenAPI documentation setup
- integration tests for auth, device pings, scoped access, history filtering, and conditional GET

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

## Deployment

This project is ready to deploy to Render using a Render web service and Render Postgres.

### Production Safety Notes

- `DATABASE_URL` and JWT secrets must be explicitly provided in production.
- placeholder secrets such as `change-this-*` are rejected in production startup.
- `CORS_ORIGIN=*` is allowed for development but rejected in production.
- `TRUST_PROXY` is configurable and should be `1` on Render.
- `GET /api/v1/health` performs a real database check and is suitable for Render health checks.

### Render Postgres

1. In the Render dashboard, create a new Postgres database.
2. Choose a region close to your web service. `singapore` is a sensible default for Sri Lanka.
3. Copy the internal connection string and use it as `DATABASE_URL`.

### Render Web Service

1. Push this repository to GitHub.
2. In Render, create a new web service from that GitHub repository.
3. Use these commands:

```text
Build Command: npm install && npm run build
Start Command: npm start
Health Check Path: /api/v1/health
```

4. Set the required environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`

Recommended environment variables:

- `NODE_ENV=production`
- `API_PREFIX=/api/v1`
- `TRUST_PROXY=1`
- `LOG_LEVEL=info`
- `SWAGGER_ENABLED=true`
- `RATE_LIMIT_WINDOW_MS=900000`
- `RATE_LIMIT_MAX=100`
- `AUTH_RATE_LIMIT_WINDOW_MS=900000`
- `AUTH_RATE_LIMIT_MAX=10`

### Prisma In Production

Use Prisma deploy migrations in production only:

```bash
npm run prisma:migrate:deploy
```

Do not use `npm run prisma:migrate:dev` in production.

The build script already runs Prisma client generation:

```bash
npm run build
```

### Optional Render Blueprint

The repository includes [render.yaml](/Users/kawishjayawardena/Desktop/Web%20API/TukAPI/render.yaml) as a simple Render Blueprint for a Node web service plus Render Postgres. You can use it as a starting point and adjust the plan, region, and secret values in the Render dashboard.

### Seeding And Demo Data After Deployment

After the production database is migrated, you can seed demo data by opening a Render shell or one-off job and running:

```bash
npm run demo:seed
npm run simulation:generate
```

If you also want export files:

```bash
npm run simulation:export
```

Note: Render web-service filesystems are ephemeral, so exported files in `exports/` are best treated as temporary evidence. For stable appendix artifacts, run exports locally against the same database or download them immediately after generation.

### Live Verification

After deployment:

1. Open `/api/v1/health`
2. Open `/docs`
3. Test `POST /api/v1/auth/login`
4. Test `GET /api/v1/locations/live`
5. Test `GET /api/v1/locations/history`
6. Test a repeated `GET /api/v1/locations/live/{tukTukId}` with `If-None-Match`

Use [LIVE_VERIFICATION.md](/Users/kawishjayawardena/Desktop/Web%20API/TukAPI/LIVE_VERIFICATION.md) during the final deployment check and [APPENDIX_LINKS_TEMPLATE.md](/Users/kawishjayawardena/Desktop/Web%20API/TukAPI/APPENDIX_LINKS_TEMPLATE.md) when preparing the report appendix.

## Testing And Quality

Run the automated checks before a demo or submission:

```bash
npm run lint
npm test
```

Current automated coverage includes:

- auth login success and failure
- unauthorized protected-route access
- valid and revoked device ping handling
- out-of-order ping storage without replacing `CurrentLocation`
- live-location pagination
- history filtering by tuk-tuk and time window
- district-scope access rejection
- conditional GET with `ETag` returning `304 Not Modified`

Supporting test helpers are under `src/tests/helpers/` and provide:

- seeded bearer-token generation for demo users
- seeded device-auth headers
- repeatable in-memory Prisma test state reset helpers
- reusable request decorators for user and device calls

## Simulation Workflow

Stage 7 adds a repeatable demo-data pipeline for coursework submission and live demonstrations.

Recommended demo date example:

```bash
export SIM_DEMO_DATE=2026-04-30
```

Optional simulation controls:

```bash
export SIM_SEED=stage7-demo
export SIM_TUK_TUK_COUNT=200
export SIM_DAYS=7
export SIM_EXPORT_DIR=exports/simulation
```

Core commands:

```bash
npm run demo:seed
npm run simulation:generate
npm run simulation:export
```

Full rebuild command:

```bash
npm run demo:rebuild
```

If you want to wipe demo data first:

```bash
npm run demo:reset
```

What gets generated:

- 9 provinces and 25 districts
- 24 police stations mapped deterministically to districts
- 200 drivers
- 200 tuk-tuks
- 200 tracking devices
- 7 demo law-enforcement users across HQ, provincial, district, and station roles
- 7 full days of historical location pings before the configured demo date
- current live location rows for the latest ping per tuk-tuk

Approximate record counts with defaults:

- `Province`: 9
- `District`: 25
- `PoliceStation`: 24
- `Driver`: 200
- `TukTuk`: 200
- `TrackingDevice`: 200
- `LocationPing`: about 65,000 to 70,000 rows
- `CurrentLocation`: 200

Simulation design summary:

- Every tuk-tuk is assigned to one home station, district, and province
- Each day is split into morning, midday, and evening activity windows
- Parked pings are generated overnight and during quiet periods
- Active windows move through small route clusters around the home station with coordinate jitter
- Historical pings are always stored, while the latest ping becomes the live location

Export output:

Generated evidence files are written to `exports/simulation/` by default:

- `station-mapping.json`
- `station-mapping.csv`
- `tuk-tuk-master-data.json`
- `tuk-tuk-master-data.csv`
- `location-history.json`
- `location-history.csv`
- `simulation-summary.json`

How to inspect the output:

```bash
ls exports/simulation
```

You can also inspect the database directly with:

```bash
npm run prisma:studio
```

## Demo Assets

Stage 8 adds two presentation helpers at the project root:

- `DEMO_CHECKLIST.md` for the step-by-step presentation flow
- `POSTMAN_REQUESTS.md` for ready-to-use request examples

Demo user accounts created by `npm run demo:seed` all use the same development-only password:

```text
DemoPass123!
```

Examples:

- `hq.admin@demo.local`
- `western.admin@demo.local`
- `colombo.officer@demo.local`
- `fort.officer@demo.local`

Sample device token for demo telemetry:

```text
demo-device-token-0001
```

## Prisma Workflow

Use these commands during development:

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
npm run prisma:seed
npm run simulation:generate
npm run simulation:export
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

- The demo data pipeline is deterministic when `SIM_SEED` and `SIM_DEMO_DATE` are provided.
- `npm run demo:rebuild` is the quickest way to reset, reseed, simulate, and export a clean submission dataset.
- The simulation model is intentionally simple and explainable rather than mathematically complex.
