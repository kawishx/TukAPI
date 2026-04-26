import { z } from 'zod';

import { idParamSchema, scopedListQuerySchema } from '../../utils/validationSchemas.js';

export const tukTukIdSchema = idParamSchema;

export const tukTukListQuerySchema = scopedListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'registrationNumber', 'status']).default('createdAt'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  driverId: z.string().trim().optional(),
  deviceId: z.string().trim().optional(),
});

export const createTukTukSchema = z.object({
  registrationNumber: z.string().trim().min(4).max(32),
  color: z.string().trim().min(2).max(50),
  model: z.string().trim().min(2).max(80),
  provinceId: z.string().trim().min(1),
  districtId: z.string().trim().min(1),
  stationId: z.string().trim().min(1),
  driverId: z.string().trim().optional(),
  deviceId: z.string().trim().optional(),
});

export const updateTukTukSchema = createTukTukSchema
  .extend({
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  })
  .partial();

