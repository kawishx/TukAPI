export const findMany = async (_options) => ({
  items: [],
  totalItems: 0,
  lastModified: new Date().toISOString(),
});

export const findById = async (id) => ({
  data: {
    id,
    registrationNumber: 'WP CAB-1234',
    color: 'Green',
    model: 'Bajaj RE',
    status: 'ACTIVE',
    provinceId: 'province_scaffold_id',
    districtId: 'district_scaffold_id',
    stationId: 'station_scaffold_id',
    driverId: 'driver_scaffold_id',
    deviceId: 'device_scaffold_id',
    isPlaceholder: true,
  },
  lastModified: new Date().toISOString(),
});

export const create = async (payload) => ({
  id: 'tuktuk_scaffold_id',
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

