# API Standards

## Purpose

This document defines the API design and implementation standards for the Sri Lanka Police tuk-tuk tracking and movement logging REST API. It serves as a project appendix and a shared reference for consistent backend development.

## Base URL And Versioning

- Base URL: `http://localhost:3000/api/v1`
- All public endpoints must be exposed under `/api/v1`.
- Breaking changes must be introduced through a new version path such as `/api/v2`.
- Non-breaking additions may be introduced within the current version.

## Route Naming Conventions

- Use plural nouns for resource collections.
- Use lowercase kebab-case for route paths.
- Prefer resource-oriented routes over action-oriented routes.
- Use nested meaning only when it improves clarity; otherwise use filter parameters.

Examples:

- `/provinces`
- `/districts`
- `/stations`
- `/tuk-tuks`
- `/devices`
- `/users`
- `/locations/live`
- `/locations/history`

## Query Parameter Conventions

### Filtering

- Use direct field-based query parameters for filtering.
- Common filters include `provinceId`, `districtId`, `stationId`, `driverId`, `deviceId`, `tukTukId`, `role`, and `status`.
- Time-window filters must use `startTime` and `endTime`.

Examples:

- `GET /tuk-tuks?provinceId=prv_western&stationId=stn_fort`
- `GET /locations/history?tukTukId=ttk_123&startTime=2026-04-01T00:00:00Z&endTime=2026-04-01T23:59:59Z`

### Sorting

- Use `sortBy` to specify the sortable field.
- Use `sortOrder` with `asc` or `desc`.
- Default sort order should be deterministic and documented per endpoint.

Example:

- `GET /drivers?sortBy=fullName&sortOrder=asc`

### Searching

- Use `search` for simple free-text matching on supported fields.
- Search behavior must be documented per endpoint.

Example:

- `GET /stations?search=fort`

### Pagination

- Use `page` and `limit` for pagination.
- Default values should be `page=1` and `limit=20`.
- Maximum `limit` should be capped to prevent abuse, for example `100`.

Example:

- `GET /users?page=2&limit=25`

## Standard Success Response Structure

Successful responses must use a consistent envelope:

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 100,
    "totalPages": 5
  }
}
```

Rules:

- `success` must always be `true` for successful responses.
- `message` should be short and human-readable.
- `data` contains the main response payload.
- `meta` is optional and should be included for paginated or list responses.

## Standard Error Response Structure

Error responses must use a consistent envelope:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "path": "body.recordedAt",
      "message": "Invalid datetime string."
    }
  ]
}
```

Rules:

- `success` must always be `false` for failed requests.
- `message` should summarize the failure clearly.
- `errors` is optional but recommended for validation and business-rule failures.
- Error details must not expose secrets, tokens, password hashes, or internal stack traces.

## Status Code Usage Rules

- `200 OK`: successful read or update request.
- `201 Created`: successful resource creation.
- `204 No Content`: successful deletion or empty body response when appropriate.
- `304 Not Modified`: conditional GET matched current resource state.
- `400 Bad Request`: malformed request or invalid parameter format.
- `401 Unauthorized`: authentication missing, expired, or invalid.
- `403 Forbidden`: authenticated caller lacks permission.
- `404 Not Found`: requested resource does not exist.
- `409 Conflict`: unique constraint or state conflict.
- `422 Unprocessable Entity`: semantically valid request rejected by validation or business rules.
- `429 Too Many Requests`: rate limit exceeded.
- `500 Internal Server Error`: unexpected server-side failure.

## Header Usage Rules

- `Authorization: Bearer <token>` for authenticated user access.
- `X-Device-Token: <token>` for device-origin location ingestion where applicable.
- `Content-Type: application/json` for JSON request bodies.
- `Accept: application/json` for API clients.
- `ETag` and `Last-Modified` for cache-aware GET responses when supported.
- `Cache-Control` for cache behavior instructions.
- `Location` on `201 Created` responses to identify the newly created resource URI.

## Conditional GET Strategy

Conditional GET should be used on read-heavy endpoints such as:

- reference data lists
- single resource lookups
- live-location reads

Rules:

- The server should return an `ETag` header based on the current response representation.
- The server should return a `Last-Modified` header when a meaningful last-update timestamp exists.
- Clients may send `If-None-Match` or `If-Modified-Since`.
- If the resource has not changed, the server should return `304 Not Modified` with no response body.
- Conditional GET should not be used for mutation endpoints such as `POST`, `PATCH`, or `DELETE`.

## Authentication And Authorization Rules

- JWT bearer authentication is required for protected law-enforcement endpoints.
- Device telemetry ingestion may use a dedicated device token instead of a user JWT.
- Authorization must be role-based and enforced at the route or service layer.
- Roles should reflect operational scope, such as national, provincial, district, station, field, and analyst access.
- Users must only access data permitted by their assigned role and geographic scope.
- Sensitive operations such as creating users, assigning devices, or modifying tracked assets should require elevated roles.

## Audit Logging Rules

- Security-sensitive and state-changing operations must be logged.
- Audit entries should capture:
  - actor type
  - actor identifier
  - action
  - entity name
  - entity identifier
  - request path
  - HTTP method
  - status code
  - timestamp
  - relevant province, district, and station scope when available
- Audit logs must be append-only.
- Audit logs must not store plaintext passwords, secrets, or raw JWTs.

## Validation Rules

- All request params, query strings, headers, and bodies must be validated before business logic executes.
- Use a schema-based validator such as Zod for consistency.
- Validation must enforce:
  - required fields
  - allowed enum values
  - ID format expectations
  - number ranges for latitude, longitude, speed, and heading
  - date-time format validity
  - pagination bounds
- Validation failures should return `400` or `422` with a structured error body.

## Date And Time Rules

- All API date-time values must use ISO 8601 in UTC.
- Use the `Z` suffix for UTC timestamps.
- Persist server-side timestamps in UTC.
- Use date-time fields consistently for:
  - `createdAt`
  - `updatedAt`
  - `recordedAt`
  - `receivedAt`
  - `lastLoginAt`

Example:

- `2026-04-26T08:25:13.000Z`

## REST Design Best Practices

- Keep endpoints resource-oriented and predictable.
- Use nouns for resources and HTTP methods for behavior.
- Separate live-location views from historical movement queries.
- Treat `LocationPing` as immutable history data.
- Treat `CurrentLocation` as the latest known state for each tuk-tuk.
- Return only necessary fields; avoid oversized payloads when listing data.
- Make list endpoints filterable by province, district, and station where relevant.
- Keep naming consistent across Prisma models, routes, controllers, and documentation.
- Prefer idempotent reads and safe updates with clear validation and authorization boundaries.
- Document every endpoint in OpenAPI and keep the implementation aligned with the specification.
