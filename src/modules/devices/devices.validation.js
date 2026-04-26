import { z } from 'zod';

import { idParamSchema, scopedListQuerySchema } from '../../utils/validationSchemas.js';

export const deviceIdSchema = idParamSchema;

export const deviceListQuerySchema = scopedListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'serialNumber', 'status']).default('createdAt'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).optional(),
});

export const createDeviceSchema = z.object({
  serialNumber: z.string().trim().min(4).max(40),
  imei: z.string().trim().min(10).max(30),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).default('ACTIVE'),
  tukTukId: z.string().trim().optional(),
});

export const updateDeviceSchema = createDeviceSchema.partial();

