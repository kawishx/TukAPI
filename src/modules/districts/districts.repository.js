export const findMany = async (_options) => ({
  items: [],
  totalItems: 0,
  lastModified: new Date().toISOString(),
});

export const findById = async (id) => ({
  data: {
    id,
    name: 'Colombo',
    code: 'COL',
    provinceId: 'province_scaffold_id',
    isPlaceholder: true,
  },
  lastModified: new Date().toISOString(),
});

export const create = async (payload) => ({
  id: 'district_scaffold_id',
  ...payload,
  createdAt: new Date().toISOString(),
  isPlaceholder: true,
});

export const update = async (id, payload) => ({
  id,
  ...payload,
  updatedAt: new Date().toISOString(),
  isPlaceholder: true,
});

