import * as devicesRepository from './devices.repository.js';
import { assertScopeAccess } from '../../utils/accessScope.js';
import { ApiError } from '../../utils/apiError.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';
import { getTukTukOrThrow } from '../../utils/regionValidation.js';

const buildDeviceScopeWhere = (user) => {
  if (user.role === 'HQ_ADMIN') {
    return {};
  }

  if (user.role === 'PROVINCIAL_ADMIN') {
    return {
      assignedTukTuk: {
        provinceId: user.provinceId,
      },
    };
  }

  if (user.role === 'DISTRICT_OFFICER') {
    return {
      assignedTukTuk: {
        districtId: user.districtId,
      },
    };
  }

  return {
    assignedTukTuk: {
      stationId: user.stationId,
    },
  };
};

const assertDeviceScope = (user, device) => {
  if (user.role === 'HQ_ADMIN') {
    return;
  }

  const scopedResource = {
    provinceId: device.assignedTukTuk?.provinceId ?? null,
    districtId: device.assignedTukTuk?.districtId ?? null,
    stationId: device.assignedTukTuk?.stationId ?? null,
  };

  if (!scopedResource.provinceId && !scopedResource.districtId && !scopedResource.stationId) {
    throw new ApiError(403, 'You are not authorized to access this resource.');
  }

  assertScopeAccess(user, scopedResource);
};

export const listDevices = async (query, user) => {
  const options = buildListOptions(query, {
    sorting: {
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
  });
  const result = await devicesRepository.findMany(options, buildDeviceScopeWhere(user));

  return {
    items: result.items,
    meta: buildPaginationMeta({
      page: options.page,
      limit: options.limit,
      totalItems: result.totalItems,
    }),
    lastModified: result.lastModified,
  };
};

export const getDeviceById = async (id, user) => {
  const result = await devicesRepository.findById(id);

  if (!result.data) {
    throw new ApiError(404, 'Tracking device not found.');
  }

  assertDeviceScope(user, result.data);

  return result;
};

export const createDevice = async (payload, user) => {
  let targetTukTuk = null;

  if (payload.tukTukId) {
    targetTukTuk = await getTukTukOrThrow(payload.tukTukId);
    assertScopeAccess(user, targetTukTuk);
    if (targetTukTuk.deviceId) {
      throw new ApiError(422, 'Selected tuk-tuk already has a tracking device assigned.');
    }
  } else if (user.role !== 'HQ_ADMIN') {
    throw new ApiError(422, 'Non-HQ users must assign a tracking device to a tuk-tuk within their scope.');
  }

  const device = await devicesRepository.create({
    serialNumber: payload.serialNumber,
    imei: payload.imei ?? null,
    simNumber: payload.simNumber ?? null,
    firmwareVersion: payload.firmwareVersion ?? null,
    status: payload.status,
  });

  if (targetTukTuk) {
    await devicesRepository.assignToTukTuk(device.id, targetTukTuk.id);
    return devicesRepository.findById(device.id).then((result) => result.data);
  }

  return device;
};

export const updateDevice = async (id, payload, user) => {
  const existingDevice = await devicesRepository.findById(id);

  if (!existingDevice.data) {
    throw new ApiError(404, 'Tracking device not found.');
  }

  assertDeviceScope(user, existingDevice.data);

  let targetTukTuk = existingDevice.data.assignedTukTuk;

  if (payload.tukTukId !== undefined) {
    if (payload.tukTukId === null) {
      targetTukTuk = null;
    } else {
      targetTukTuk = await getTukTukOrThrow(payload.tukTukId);
      assertScopeAccess(user, targetTukTuk);

      if (targetTukTuk.deviceId && targetTukTuk.deviceId !== id) {
        throw new ApiError(422, 'Selected tuk-tuk already has a tracking device assigned.');
      }
    }
  }

  const updatedDevice = await devicesRepository.update(id, {
    serialNumber: payload.serialNumber,
    imei: payload.imei,
    simNumber: payload.simNumber,
    firmwareVersion: payload.firmwareVersion,
    status: payload.status,
  });

  if (payload.tukTukId !== undefined) {
    await devicesRepository.clearAssignment(id);

    if (targetTukTuk) {
      await devicesRepository.assignToTukTuk(id, targetTukTuk.id);
    }

    return devicesRepository.findById(id).then((result) => result.data);
  }

  return updatedDevice;
};
