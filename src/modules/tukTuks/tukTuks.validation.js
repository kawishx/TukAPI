import { z } from 'zod';

import {
  booleanFromStringSchema,
  idParamSchema,
  nullableIdSchema,
  scopedListQuerySchema,
  tukTukStatusSchema,
} from '../../utils/validationSchemas.js';

export const tukTukIdSchema = idParamSchema;

export const tukTukListQuerySchema = scopedListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'registrationNumber', 'status']).default('createdAt'),
  status: tukTukStatusSchema.optional(),
  driverId: z.string().trim().optional(),
  deviceId: z.string().trim().optional(),
  plateNumber: z.string().trim().optional(),
  registrationNumber: z.string().trim().optional(),
});

export const createTukTukSchema = z.object({
  registrationNumber: z.string().trim().min(4).max(32),
  plateNumber: z.string().trim().min(4).max(32),
  color: z.string().trim().min(2).max(50).optional(),
  model: z.string().trim().min(2).max(80),
  provinceId: z.string().trim().min(1),
  districtId: z.string().trim().min(1),
  stationId: z.string().trim().min(1),
  driverId: nullableIdSchema,
  deviceId: nullableIdSchema,
  status: tukTukStatusSchema.default('ACTIVE'),
  notes: z.string().trim().max(500).optional(),
});

export const updateTukTukSchema = createTukTukSchema
  .partial();

export const tukTukLocationHistoryQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['recordedAt', 'receivedAt', 'createdAt']).default('recordedAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    ignitionOn: booleanFromStringSchema.optional(),
  })
  .superRefine((query, ctx) => {
    if (!query.from || !query.to) {
      return;
    }

    if (new Date(query.from).getTime() > new Date(query.to).getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['to'],
        message: '`to` must be greater than or equal to `from`.',
      });
    }
  });
