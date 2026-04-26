export const create = async (payload) => ({
  id: 'location_ping_scaffold_id',
  ...payload,
  receivedAt: new Date().toISOString(),
  isPlaceholder: true,
});

export const findLatestByTukTukId = async (tukTukId) => ({
  data: {
    tukTukId,
    latitude: 6.9271,
    longitude: 79.8612,
    speedKph: 32,
    heading: 180,
    recordedAt: new Date().toISOString(),
    deviceId: 'device_scaffold_id',
    stationId: 'station_scaffold_id',
    isPlaceholder: true,
  },
  lastModified: new Date().toISOString(),
});

export const findHistory = async (_options) => ({
  items: [],
  totalItems: 0,
  lastModified: new Date().toISOString(),
});

