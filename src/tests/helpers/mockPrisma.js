import { hashOpaqueToken } from '../../modules/auth/auth.tokens.js';
import { hashPassword } from '../../utils/password.js';

const toDate = (value) => (value instanceof Date ? value : new Date(value));

let baseState;
let state;

const buildBaseState = async () => {
  const passwordHash = await hashPassword('DemoPass123!');

  return {
    provinces: [
      { id: 'prv-wp', code: 'WP', name: 'Western Province', createdAt: new Date('2026-04-01T00:00:00.000Z'), updatedAt: new Date('2026-04-01T00:00:00.000Z') },
    ],
    districts: [
      { id: 'dst-col', provinceId: 'prv-wp', code: 'COL', name: 'Colombo', createdAt: new Date('2026-04-01T00:00:00.000Z'), updatedAt: new Date('2026-04-01T00:00:00.000Z') },
      { id: 'dst-gam', provinceId: 'prv-wp', code: 'GAM', name: 'Gampaha', createdAt: new Date('2026-04-01T00:00:00.000Z'), updatedAt: new Date('2026-04-01T00:00:00.000Z') },
    ],
    stations: [
      {
        id: 'stn-fort',
        provinceId: 'prv-wp',
        districtId: 'dst-col',
        code: 'FORT',
        name: 'Fort Police Station',
        address: 'Colombo 01',
        contactNumber: '+94110000001',
        isActive: true,
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
      },
      {
        id: 'stn-neg',
        provinceId: 'prv-wp',
        districtId: 'dst-gam',
        code: 'NEG',
        name: 'Negombo Police Station',
        address: 'Negombo',
        contactNumber: '+94310000001',
        isActive: true,
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
      },
    ],
    drivers: [
      {
        id: 'drv-1',
        provinceId: 'prv-wp',
        districtId: 'dst-col',
        stationId: 'stn-fort',
        fullName: 'Kasun Perera',
        nationalId: '198512340001',
        licenseNumber: 'B7000001',
        isActive: true,
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
      },
      {
        id: 'drv-2',
        provinceId: 'prv-wp',
        districtId: 'dst-gam',
        stationId: 'stn-neg',
        fullName: 'Nimal Silva',
        nationalId: '198512340002',
        licenseNumber: 'B7000002',
        isActive: true,
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
      },
    ],
    devices: [
      {
        id: 'dev-1',
        serialNumber: 'SIM-TD-001',
        authTokenHash: hashOpaqueToken('device-token-001'),
        status: 'ACTIVE',
        lastSeenAt: new Date('2026-04-28T05:00:00.000Z'),
        lastAuthenticatedAt: new Date('2026-04-28T05:00:30.000Z'),
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-28T05:00:30.000Z'),
      },
      {
        id: 'dev-2',
        serialNumber: 'SIM-TD-002',
        authTokenHash: hashOpaqueToken('device-token-002'),
        status: 'RETIRED',
        lastSeenAt: null,
        lastAuthenticatedAt: null,
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
      },
      {
        id: 'dev-3',
        serialNumber: 'SIM-TD-003',
        authTokenHash: hashOpaqueToken('device-token-003'),
        status: 'ACTIVE',
        lastSeenAt: null,
        lastAuthenticatedAt: null,
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
      },
    ],
    tukTuks: [
      {
        id: 'ttk-col-1',
        provinceId: 'prv-wp',
        districtId: 'dst-col',
        stationId: 'stn-fort',
        driverId: 'drv-1',
        deviceId: 'dev-1',
        registrationNumber: 'REG-2026-000001',
        plateNumber: 'WP-CAB-5001',
        model: 'Bajaj RE',
        color: 'Green',
        status: 'ACTIVE',
        notes: 'Simulation fleet vehicle 001.',
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
      },
      {
        id: 'ttk-gam-1',
        provinceId: 'prv-wp',
        districtId: 'dst-gam',
        stationId: 'stn-neg',
        driverId: 'drv-2',
        deviceId: 'dev-3',
        registrationNumber: 'REG-2026-000002',
        plateNumber: 'WP-CAB-5002',
        model: 'Piaggio Ape',
        color: 'Yellow',
        status: 'ACTIVE',
        notes: 'Simulation fleet vehicle 002.',
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
      },
    ],
    users: [
      {
        id: 'usr-hq',
        fullName: 'HQ Administrator',
        email: 'hq.admin@demo.local',
        badgeNumber: 'HQ-001',
        passwordHash,
        refreshTokenHash: null,
        role: 'HQ_ADMIN',
        provinceId: null,
        districtId: null,
        stationId: null,
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
      },
      {
        id: 'usr-col',
        fullName: 'Colombo District Officer',
        email: 'colombo.officer@demo.local',
        badgeNumber: 'DT-COL-001',
        passwordHash,
        refreshTokenHash: null,
        role: 'DISTRICT_OFFICER',
        provinceId: 'prv-wp',
        districtId: 'dst-col',
        stationId: null,
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
      },
    ],
    currentLocations: [
      {
        id: 'cur-1',
        tukTukId: 'ttk-col-1',
        deviceId: 'dev-1',
        provinceId: 'prv-wp',
        districtId: 'dst-col',
        stationId: 'stn-fort',
        latitude: 6.9344,
        longitude: 79.8428,
        speedKph: 18.5,
        heading: 165.2,
        accuracyM: 5.1,
        ignitionOn: true,
        recordedAt: new Date('2026-04-29T08:00:00.000Z'),
        receivedAt: new Date('2026-04-29T08:00:20.000Z'),
        createdAt: new Date('2026-04-29T08:00:20.000Z'),
        updatedAt: new Date('2026-04-29T08:00:20.000Z'),
      },
      {
        id: 'cur-2',
        tukTukId: 'ttk-gam-1',
        deviceId: 'dev-3',
        provinceId: 'prv-wp',
        districtId: 'dst-gam',
        stationId: 'stn-neg',
        latitude: 7.2083,
        longitude: 79.8358,
        speedKph: 0,
        heading: null,
        accuracyM: 4.5,
        ignitionOn: false,
        recordedAt: new Date('2026-04-29T08:05:00.000Z'),
        receivedAt: new Date('2026-04-29T08:05:18.000Z'),
        createdAt: new Date('2026-04-29T08:05:18.000Z'),
        updatedAt: new Date('2026-04-29T08:05:18.000Z'),
      },
    ],
    locationPings: [
      {
        id: 'lpg-1',
        tukTukId: 'ttk-col-1',
        deviceId: 'dev-1',
        provinceId: 'prv-wp',
        districtId: 'dst-col',
        stationId: 'stn-fort',
        latitude: 6.9344,
        longitude: 79.8428,
        speedKph: 18.5,
        heading: 165.2,
        accuracyM: 5.1,
        ignitionOn: true,
        recordedAt: new Date('2026-04-29T08:00:00.000Z'),
        receivedAt: new Date('2026-04-29T08:00:20.000Z'),
        createdAt: new Date('2026-04-29T08:00:20.000Z'),
      },
      {
        id: 'lpg-2',
        tukTukId: 'ttk-gam-1',
        deviceId: 'dev-3',
        provinceId: 'prv-wp',
        districtId: 'dst-gam',
        stationId: 'stn-neg',
        latitude: 7.2083,
        longitude: 79.8358,
        speedKph: 0,
        heading: null,
        accuracyM: 4.5,
        ignitionOn: false,
        recordedAt: new Date('2026-04-29T08:05:00.000Z'),
        receivedAt: new Date('2026-04-29T08:05:18.000Z'),
        createdAt: new Date('2026-04-29T08:05:18.000Z'),
      },
    ],
    auditLogs: [],
    nextLocationPingId: 3,
    nextCurrentLocationId: 3,
  };
};

export const resetMockData = async () => {
  if (!baseState) {
    baseState = await buildBaseState();
  }

  state = structuredClone(baseState);
};

export const getMockState = () => state;

const cloneRecord = (record) => (record ? structuredClone(record) : null);

const findProvince = (id) => state.provinces.find((province) => province.id === id);
const findDistrict = (id) => state.districts.find((district) => district.id === id);
const findStation = (id) => state.stations.find((station) => station.id === id);
const findDriver = (id) => state.drivers.find((driver) => driver.id === id);
const findDevice = (id) => state.devices.find((device) => device.id === id);
const findTukTuk = (id) => state.tukTuks.find((tukTuk) => tukTuk.id === id);

const includeTukTukRelations = (tukTuk) => {
  if (!tukTuk) {
    return null;
  }

  return {
    ...tukTuk,
    province: cloneRecord(findProvince(tukTuk.provinceId)),
    district: cloneRecord(findDistrict(tukTuk.districtId)),
    station: cloneRecord(findStation(tukTuk.stationId)),
    driver: cloneRecord(findDriver(tukTuk.driverId)),
    device: cloneRecord(findDevice(tukTuk.deviceId)),
  };
};

const includeLocationRelations = (location) => {
  if (!location) {
    return null;
  }

  const tukTuk = findTukTuk(location.tukTukId);

  return {
    ...location,
    tukTuk: tukTuk
      ? {
          id: tukTuk.id,
          registrationNumber: tukTuk.registrationNumber,
          plateNumber: tukTuk.plateNumber,
          model: tukTuk.model,
          status: tukTuk.status,
        }
      : null,
    device: location.deviceId
      ? (() => {
          const device = findDevice(location.deviceId);

          return device
            ? {
                id: device.id,
                serialNumber: device.serialNumber,
                status: device.status,
                lastSeenAt: device.lastSeenAt,
              }
            : null;
        })()
      : null,
    province: cloneRecord(findProvince(location.provinceId)),
    district: cloneRecord(findDistrict(location.districtId)),
    station: cloneRecord(findStation(location.stationId)),
  };
};

const sortRecords = (records, orderBy = {}) => {
  const [[field, direction]] = Object.entries(orderBy);
  const multiplier = direction === 'asc' ? 1 : -1;

  return [...records].sort((left, right) => {
    const leftValue = left[field];
    const rightValue = right[field];

    if (leftValue instanceof Date && rightValue instanceof Date) {
      return (leftValue.getTime() - rightValue.getTime()) * multiplier;
    }

    if (leftValue === rightValue) {
      return 0;
    }

    return (leftValue > rightValue ? 1 : -1) * multiplier;
  });
};

const paginateRecords = (records, skip = 0, take = records.length) => records.slice(skip, skip + take);

const resolveRelatedEntity = (record, key) => {
  switch (key) {
    case 'tukTuk':
      return findTukTuk(record.tukTukId);
    case 'device':
      return record.deviceId ? findDevice(record.deviceId) : null;
    case 'station':
      return record.stationId ? findStation(record.stationId) : null;
    case 'district':
      return record.districtId ? findDistrict(record.districtId) : null;
    case 'province':
      return record.provinceId ? findProvince(record.provinceId) : null;
    default:
      return null;
  }
};

const matchesWhere = (record, where) => {
  if (!where || Object.keys(where).length === 0) {
    return true;
  }

  if (where.AND) {
    return where.AND.every((clause) => matchesWhere(record, clause));
  }

  if (where.OR) {
    return where.OR.some((clause) => matchesWhere(record, clause));
  }

  return Object.entries(where).every(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if ('in' in value) {
        return value.in.includes(record[key]);
      }

      if ('gte' in value || 'lte' in value) {
        const currentValue = toDate(record[key]).getTime();
        const minValue = value.gte ? toDate(value.gte).getTime() : -Infinity;
        const maxValue = value.lte ? toDate(value.lte).getTime() : Infinity;
        return currentValue >= minValue && currentValue <= maxValue;
      }

      if ('contains' in value) {
        const currentValue = String(record[key] ?? '').toLowerCase();
        return currentValue.includes(String(value.contains).toLowerCase());
      }

      if ('startsWith' in value) {
        const currentValue = String(record[key] ?? '').toLowerCase();
        return currentValue.startsWith(String(value.startsWith).toLowerCase());
      }

      const relatedEntity = resolveRelatedEntity(record, key);
      return relatedEntity ? matchesWhere(relatedEntity, value.is ?? value) : false;
    }

    return record[key] === value;
  });
};

const buildAssignedTukTukForDevice = (device) => {
  const assignedTukTuk = state.tukTuks.find((tukTuk) => tukTuk.deviceId === device.id);

  if (!assignedTukTuk) {
    return null;
  }

  return {
    id: assignedTukTuk.id,
    provinceId: assignedTukTuk.provinceId,
    districtId: assignedTukTuk.districtId,
    stationId: assignedTukTuk.stationId,
    status: assignedTukTuk.status,
  };
};

export const mockCheckDatabaseHealth = async () => undefined;

export const mockPrisma = {
  user: {
    findUnique: async ({ where }) => cloneRecord(
      state.users.find((user) =>
        (where.id && user.id === where.id) || (where.email && user.email === where.email)),
    ),
    update: async ({ where, data }) => {
      const user = state.users.find((entry) => entry.id === where.id);
      Object.assign(user, data, { updatedAt: new Date() });
      return cloneRecord(user);
    },
  },
  trackingDevice: {
    findFirst: async ({ where }) => {
      const device = state.devices.find((entry) =>
        entry.id === where.id && entry.authTokenHash === where.authTokenHash && entry.status === where.status);

      return device
        ? {
            ...cloneRecord(device),
            assignedTukTuk: buildAssignedTukTukForDevice(device),
          }
        : null;
    },
    findUnique: async ({ where, select }) => {
      const device = state.devices.find((entry) => entry.id === where.id);

      if (!device) {
        return null;
      }

      if (!select) {
        return cloneRecord(device);
      }

      return Object.fromEntries(Object.keys(select).map((key) => [key, device[key]]));
    },
    update: async ({ where, data }) => {
      const device = state.devices.find((entry) => entry.id === where.id);
      Object.assign(device, data, { updatedAt: new Date() });
      return cloneRecord(device);
    },
    updateMany: async ({ where, data }) => {
      const devices = state.devices.filter((device) => matchesWhere(device, where));
      devices.forEach((device) => Object.assign(device, data, { updatedAt: new Date() }));
      return { count: devices.length };
    },
  },
  currentLocation: {
    findUnique: async ({ where, select }) => {
      const currentLocation = state.currentLocations.find((entry) => entry.tukTukId === where.tukTukId);

      if (!currentLocation) {
        return null;
      }

      if (!select) {
        return cloneRecord(currentLocation);
      }

      return Object.fromEntries(Object.keys(select).map((key) => [key, currentLocation[key]]));
    },
    findFirst: async ({ where }) => cloneRecord(
      includeLocationRelations(state.currentLocations.find((entry) => matchesWhere(entry, where))),
    ),
    findMany: async ({ where, orderBy, skip, take }) =>
      paginateRecords(
        sortRecords(
          state.currentLocations.filter((entry) => matchesWhere(entry, where)).map(includeLocationRelations),
          orderBy,
        ),
        skip,
        take,
      ).map(cloneRecord),
    count: async ({ where }) => state.currentLocations.filter((entry) => matchesWhere(entry, where)).length,
    create: async ({ data }) => {
      const currentLocation = {
        id: `cur-${state.nextCurrentLocationId++}`,
        ...data,
        createdAt: new Date(data.receivedAt ?? data.recordedAt ?? new Date()),
        updatedAt: new Date(data.receivedAt ?? data.recordedAt ?? new Date()),
      };

      state.currentLocations.push(currentLocation);
      return cloneRecord(currentLocation);
    },
    update: async ({ where, data }) => {
      const currentLocation = state.currentLocations.find((entry) => entry.tukTukId === where.tukTukId);
      Object.assign(currentLocation, data, { updatedAt: new Date(data.receivedAt ?? new Date()) });
      return cloneRecord(currentLocation);
    },
  },
  locationPing: {
    create: async ({ data }) => {
      const locationPing = {
        id: `lpg-${state.nextLocationPingId++}`,
        ...data,
        createdAt: new Date(data.receivedAt ?? data.recordedAt ?? new Date()),
      };

      state.locationPings.push(locationPing);
      return cloneRecord(includeLocationRelations(locationPing));
    },
    findMany: async ({ where, orderBy, skip, take }) =>
      paginateRecords(
        sortRecords(
          state.locationPings.filter((entry) => matchesWhere(entry, where)).map(includeLocationRelations),
          orderBy,
        ),
        skip,
        take,
      ).map(cloneRecord),
    count: async ({ where }) => state.locationPings.filter((entry) => matchesWhere(entry, where)).length,
  },
  tukTuk: {
    findUnique: async ({ where }) => cloneRecord(
      includeTukTukRelations(state.tukTuks.find((entry) => entry.id === where.id || entry.registrationNumber === where.registrationNumber)),
    ),
    findFirst: async ({ where, select }) => {
      const tukTuk = state.tukTuks.find((entry) => matchesWhere(entry, where));

      if (!tukTuk) {
        return null;
      }

      if (!select) {
        return cloneRecord(tukTuk);
      }

      return Object.fromEntries(Object.keys(select).map((key) => [key, tukTuk[key]]));
    },
  },
  auditLog: {
    create: async ({ data }) => {
      state.auditLogs.push({ id: `audit-${state.auditLogs.length + 1}`, ...data });
      return { count: 1 };
    },
  },
  province: {
    findMany: async () => [],
    count: async () => 0,
    findUnique: async () => null,
  },
  $transaction: async (callback) => (typeof callback === 'function' ? callback(mockPrisma) : Promise.all(callback)),
  $connect: async () => undefined,
  $disconnect: async () => undefined,
  $queryRaw: async () => [{ '?column?': 1 }],
};
