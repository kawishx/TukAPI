import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const LOCAL_DATABASE_FALLBACK = 'postgresql://postgres:postgres@localhost:5432/tukapi?schema=public';
const LOCAL_JWT_SECRET_FALLBACK = 'change-this-secret-now';

const booleanFromStringSchema = z.preprocess((value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }
  }

  return value;
}, z.boolean());

const trustProxySchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return value;
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }

    if (/^\d+$/.test(normalized)) {
      return Number.parseInt(normalized, 10);
    }

    return value.trim();
  }

  return value;
}, z.union([z.boolean(), z.number().int().nonnegative(), z.string().min(1)]));

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(16).optional(),
  JWT_ACCESS_SECRET: z.string().min(16).optional(),
  JWT_REFRESH_SECRET: z.string().min(16).optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15).default(10),
  CORS_ORIGIN: z.string().default('*'),
  API_PREFIX: z.string().default('/api/v1'),
  TRUST_PROXY: trustProxySchema.optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  SWAGGER_ENABLED: booleanFromStringSchema.default(true),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration', parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

const resolvedEnv = {
  ...parsedEnv.data,
  DATABASE_URL:
    parsedEnv.data.DATABASE_URL ??
    (parsedEnv.data.NODE_ENV === 'production' ? undefined : LOCAL_DATABASE_FALLBACK),
  JWT_SECRET:
    parsedEnv.data.JWT_SECRET ??
    (parsedEnv.data.NODE_ENV === 'production' ? undefined : LOCAL_JWT_SECRET_FALLBACK),
  TRUST_PROXY:
    parsedEnv.data.TRUST_PROXY ??
    (parsedEnv.data.NODE_ENV === 'production' ? 1 : false),
};

resolvedEnv.JWT_ACCESS_SECRET = parsedEnv.data.JWT_ACCESS_SECRET ?? resolvedEnv.JWT_SECRET;
resolvedEnv.JWT_REFRESH_SECRET =
  parsedEnv.data.JWT_REFRESH_SECRET ?? (resolvedEnv.JWT_SECRET ? `${resolvedEnv.JWT_SECRET}-refresh` : undefined);

const productionValidationErrors = [];

if (resolvedEnv.NODE_ENV === 'production') {
  if (!resolvedEnv.DATABASE_URL) {
    productionValidationErrors.push('DATABASE_URL is required in production.');
  }

  if (!resolvedEnv.JWT_SECRET) {
    productionValidationErrors.push('JWT_SECRET is required in production.');
  }

  if (resolvedEnv.CORS_ORIGIN.trim() === '*') {
    productionValidationErrors.push('CORS_ORIGIN must be an explicit origin list in production.');
  }

  const secretValues = [
    ['JWT_SECRET', resolvedEnv.JWT_SECRET],
    ['JWT_ACCESS_SECRET', resolvedEnv.JWT_ACCESS_SECRET],
    ['JWT_REFRESH_SECRET', resolvedEnv.JWT_REFRESH_SECRET],
  ];

  for (const [key, value] of secretValues) {
    if (!value || value.startsWith('change-this-')) {
      productionValidationErrors.push(`${key} must be set to a non-placeholder value in production.`);
    }
  }
}

if (productionValidationErrors.length > 0) {
  console.error('Invalid production environment configuration', productionValidationErrors);
  process.exit(1);
}

export const env = resolvedEnv;
export const isProduction = env.NODE_ENV === 'production';
