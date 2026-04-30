import { z } from 'zod';

import {
  booleanFromStringSchema,
  idParamSchema,
  nullableIdSchema,
  scopedListQuerySchema,
  userRoleSchema,
} from '../../utils/validationSchemas.js';
import { USER_ROLES } from '../../utils/constants.js';

export const userIdSchema = idParamSchema;
export const manageableUserRoleSchema = z.enum([
  USER_ROLES.HQ_ADMIN,
  USER_ROLES.PROVINCIAL_ADMIN,
  USER_ROLES.DISTRICT_OFFICER,
  USER_ROLES.STATION_OFFICER,
]);

export const userListQuerySchema = scopedListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'fullName', 'email', 'role']).default('createdAt'),
  role: userRoleSchema.optional(),
  isActive: booleanFromStringSchema.optional(),
});

export const createUserSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email(),
  badgeNumber: z.string().trim().min(3).max(30).optional(),
  password: z.string().min(8).max(128),
  phoneNumber: z.string().trim().min(8).max(20).optional(),
  role: manageableUserRoleSchema,
  provinceId: z.string().trim().optional(),
  districtId: z.string().trim().optional(),
  stationId: z.string().trim().optional(),
  isActive: booleanFromStringSchema.default(true),
});

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .extend({
    password: z.string().min(8).max(128).optional(),
    provinceId: nullableIdSchema,
    districtId: nullableIdSchema,
    stationId: nullableIdSchema,
  })
  .partial();
