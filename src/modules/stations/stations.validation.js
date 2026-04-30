import { z } from 'zod';

import {
  booleanFromStringSchema,
  idParamSchema,
  scopedListQuerySchema,
} from '../../utils/validationSchemas.js';

export const stationIdSchema = idParamSchema;

export const stationListQuerySchema = scopedListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'code']).default('name'),
  isActive: booleanFromStringSchema.optional(),
});

export const createStationSchema = z.object({
  name: z.string().trim().min(2).max(160),
  code: z.string().trim().min(2).max(20),
  address: z.string().trim().min(5).max(255),
  contactNumber: z.string().trim().min(7).max(20).optional(),
  provinceId: z.string().trim().min(1),
  districtId: z.string().trim().min(1),
  isActive: booleanFromStringSchema.default(true),
});

export const updateStationSchema = createStationSchema.partial();
