import { z } from 'zod';

import { ALL_USER_ROLES } from './constants.js';

export const booleanFromStringSchema = z.preprocess((value) => {
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

export const idParamSchema = z.object({
  id: z.string().trim().min(1),
});

export const tukTukIdParamSchema = z.object({
  tukTukId: z.string().trim().min(1),
});

export const baseListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().trim().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().trim().optional(),
});

export const scopedListQuerySchema = baseListQuerySchema.extend({
  provinceId: z.string().trim().optional(),
  districtId: z.string().trim().optional(),
  stationId: z.string().trim().optional(),
});

export const userRoleSchema = z.enum(ALL_USER_ROLES);
