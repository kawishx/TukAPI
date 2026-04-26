export const findMany = async (_options) => ({
  items: [],
  totalItems: 0,
  lastModified: new Date().toISOString(),
});

export const findById = async (id) => ({
  data: {
    id,
    fullName: 'Kasun Perera',
    nationalId: '199512345678',
    licenseNumber: 'B1234567',
    phoneNumber: '+94771234567',
    stationId: 'station_scaffold_id',
    isPlaceholder: true,
  },
  lastModified: new Date().toISOString(),
});

export const create = async (payload) => ({
  id: 'driver_scaffold_id',
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

