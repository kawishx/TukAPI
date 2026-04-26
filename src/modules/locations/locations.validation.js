import { z } from 'zod';

import { scopedListQuerySchema, tukTukIdParamSchema } from '../../utils/validationSchemas.js';

export const liveLocationParamSchema = tukTukIdParamSchema;

export const locationPingSchema = z.object({
  tukTukId: z.string().trim().min(1),
  deviceId: z.string().trim().min(1),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  speedKph: z.coerce.number().min(0).max(200).optional(),
  heading: z.coerce.number().min(0).max(360).optional(),
  recordedAt: z.string().datetime(),
  provinceId: z.string().trim().optional(),
  districtId: z.string().trim().optional(),
  stationId: z.string().trim().optional(),
});

export const locationHistoryQuerySchema = scopedListQuerySchema.extend({
  tukTukId: z.string().trim().optional(),
  deviceId: z.string().trim().optional(),
  sortBy: z.enum(['recordedAt', 'receivedAt', 'createdAt']).default('recordedAt'),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
});

