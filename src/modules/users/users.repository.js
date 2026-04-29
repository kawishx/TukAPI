export const findMany = async (_options) => ({
  items: [],
  totalItems: 0,
  lastModified: new Date().toISOString(),
});

export const findById = async (id) => ({
  data: {
    id,
    fullName: 'Inspector Silva',
    email: 'inspector.silva@police.gov.lk',
    badgeNumber: 'SLP-1001',
    role: 'STATION_OFFICER',
    stationId: 'station_scaffold_id',
    isActive: true,
    isPlaceholder: true,
  },
  lastModified: new Date().toISOString(),
});

export const create = async (payload) => ({
  id: 'user_scaffold_id',
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
