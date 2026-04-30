import { z } from 'zod';

import {
  booleanFromStringSchema,
  scopedListQuerySchema,
  tukTukIdParamSchema,
  tukTukStatusSchema,
} from '../../utils/validationSchemas.js';

export const liveLocationParamSchema = tukTukIdParamSchema;
export const liveLocationQuerySchema = scopedListQuerySchema.extend({
  tukTukId: z.string().trim().optional(),
  deviceId: z.string().trim().optional(),
  status: tukTukStatusSchema.optional(),
  updatedAfter: z.string().datetime().optional(),
  sortBy: z.enum(['recordedAt', 'receivedAt', 'updatedAt', 'createdAt']).default('recordedAt'),
});

export const locationPingSchema = z
  .object({
    tukTukId: z.string().trim().min(1),
    deviceId: z.string().trim().min(1),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    speedKmh: z.coerce.number().min(0).max(200).optional(),
    speedKph: z.coerce.number().min(0).max(200).optional(),
    heading: z.coerce.number().min(0).max(360).optional(),
    accuracyM: z.coerce.number().min(0).max(1000).optional(),
    ignitionOn: z.boolean().optional(),
    recordedAt: z.string().datetime(),
    provinceId: z.string().trim().min(1),
    districtId: z.string().trim().min(1),
    stationId: z.string().trim().optional(),
  })
  .transform(({ speedKmh, speedKph, ...payload }) => ({
    ...payload,
    speedKph: speedKmh ?? speedKph,
  }));

export const locationHistoryQuerySchema = scopedListQuerySchema.extend({
  tukTukId: z.string().trim().optional(),
  deviceId: z.string().trim().optional(),
  ignitionOn: booleanFromStringSchema.optional(),
  sortBy: z.enum(['recordedAt', 'receivedAt', 'createdAt']).default('recordedAt'),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
}).superRefine((query, ctx) => {
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
