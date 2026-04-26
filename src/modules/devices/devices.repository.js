export const findMany = async (_options) => ({
  items: [],
  totalItems: 0,
  lastModified: new Date().toISOString(),
});

export const findById = async (id) => ({
  data: {
    id,
    serialNumber: 'TD-0001',
    imei: '359881234567890',
    status: 'ACTIVE',
    installedAt: new Date().toISOString(),
    tukTukId: 'tuktuk_scaffold_id',
    isPlaceholder: true,
  },
  lastModified: new Date().toISOString(),
});

export const create = async (payload) => ({
  id: 'device_scaffold_id',
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

