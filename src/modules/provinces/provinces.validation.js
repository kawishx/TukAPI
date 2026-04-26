import { z } from 'zod';

import { baseListQuerySchema, idParamSchema } from '../../utils/validationSchemas.js';

export const provinceIdSchema = idParamSchema;

export const provinceListQuerySchema = baseListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'code']).default('name'),
});

export const createProvinceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  code: z.string().trim().min(2).max(10),
});

export const updateProvinceSchema = createProvinceSchema.partial();

