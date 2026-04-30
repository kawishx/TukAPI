import { z } from 'zod';

import {
  booleanFromStringSchema,
  idParamSchema,
  scopedListQuerySchema,
} from '../../utils/validationSchemas.js';

export const driverIdSchema = idParamSchema;

export const driverListQuerySchema = scopedListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'fullName', 'licenseNumber']).default('createdAt'),
  isActive: booleanFromStringSchema.optional(),
  licenseNumber: z.string().trim().optional(),
  nationalId: z.string().trim().optional(),
});

export const createDriverSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  nationalId: z.string().trim().min(6).max(20),
  licenseNumber: z.string().trim().min(4).max(30),
  phoneNumber: z.string().trim().min(8).max(20).optional(),
  address: z.string().trim().max(255).optional(),
  stationId: z.string().trim().min(1),
  isActive: booleanFromStringSchema.default(true),
});

export const updateDriverSchema = createDriverSchema.partial();
