import { z } from 'zod';

import {
  booleanFromStringSchema,
  idParamSchema,
  scopedListQuerySchema,
  userRoleSchema,
} from '../../utils/validationSchemas.js';

export const userIdSchema = idParamSchema;

export const userListQuerySchema = scopedListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'fullName', 'email', 'role']).default('createdAt'),
  role: userRoleSchema.optional(),
  includeInactive: booleanFromStringSchema.default(false),
});

export const createUserSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email(),
  badgeNumber: z.string().trim().min(3).max(30),
  role: userRoleSchema,
  provinceId: z.string().trim().optional(),
  districtId: z.string().trim().optional(),
  stationId: z.string().trim().optional(),
});

export const updateUserSchema = createUserSchema.partial();
