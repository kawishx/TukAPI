import { z } from 'zod';

import { idParamSchema, scopedListQuerySchema } from '../../utils/validationSchemas.js';

export const driverIdSchema = idParamSchema;

export const driverListQuerySchema = scopedListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'fullName', 'licenseNumber']).default('createdAt'),
});

export const createDriverSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  nationalId: z.string().trim().min(6).max(20),
  licenseNumber: z.string().trim().min(4).max(30),
  phoneNumber: z.string().trim().min(8).max(20),
  stationId: z.string().trim().min(1),
});

export const updateDriverSchema = createDriverSchema.partial();

