import { z } from 'zod';

import { idParamSchema, scopedListQuerySchema } from '../../utils/validationSchemas.js';

export const districtIdSchema = idParamSchema;

export const districtListQuerySchema = scopedListQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'code']).default('name'),
  provinceCode: z.string().trim().optional(),
});
