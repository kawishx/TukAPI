import { z } from 'zod';

import { idParamSchema, scopedListQuerySchema } from '../../utils/validationSchemas.js';

export const districtIdSchema = idParamSchema;

export const districtListQuerySchema = scopedListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'code']).default('name'),
});

export const createDistrictSchema = z.object({
  name: z.string().trim().min(2).max(120),
  code: z.string().trim().min(2).max(10),
  provinceId: z.string().trim().min(1),
});

export const updateDistrictSchema = createDistrictSchema.partial();

