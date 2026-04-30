import { z } from 'zod';

import {
  deviceStatusSchema,
  idParamSchema,
  nullableIdSchema,
  scopedListQuerySchema,
} from '../../utils/validationSchemas.js';

export const deviceIdSchema = idParamSchema;

export const deviceListQuerySchema = scopedListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'serialNumber', 'status']).default('createdAt'),
  status: deviceStatusSchema.optional(),
  serialNumber: z.string().trim().optional(),
  tukTukId: z.string().trim().optional(),
});

export const createDeviceSchema = z.object({
  serialNumber: z.string().trim().min(4).max(40),
  imei: z.string().trim().min(10).max(30).optional(),
  simNumber: z.string().trim().min(5).max(30).optional(),
  firmwareVersion: z.string().trim().min(1).max(40).optional(),
  status: deviceStatusSchema.default('ACTIVE'),
  tukTukId: nullableIdSchema,
});

export const updateDeviceSchema = createDeviceSchema.partial();
