import prisma from '../config/prisma.js';
import { ApiError } from './apiError.js';

const validationError = (message) => new ApiError(422, message);

export const getProvinceOrThrow = async (provinceId) => {
  const province = await prisma.province.findUnique({
    where: { id: provinceId },
  });

  if (!province) {
    throw validationError('Province does not exist.');
  }

  return province;
};

export const getDistrictOrThrow = async (districtId) => {
  const district = await prisma.district.findUnique({
    where: { id: districtId },
  });

  if (!district) {
    throw validationError('District does not exist.');
  }

  return district;
};

export const getStationOrThrow = async (stationId) => {
  const station = await prisma.policeStation.findUnique({
    where: { id: stationId },
  });

  if (!station) {
    throw validationError('Police station does not exist.');
  }

  return station;
};

export const getDriverOrThrow = async (driverId) => {
  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
  });

  if (!driver) {
    throw validationError('Driver does not exist.');
  }

  return driver;
};

export const getTukTukOrThrow = async (tukTukId) => {
  const tukTuk = await prisma.tukTuk.findUnique({
    where: { id: tukTukId },
  });

  if (!tukTuk) {
    throw validationError('Tuk-tuk does not exist.');
  }

  return tukTuk;
};

export const getDeviceOrThrow = async (deviceId) => {
  const device = await prisma.trackingDevice.findUnique({
    where: { id: deviceId },
  });

  if (!device) {
    throw validationError('Tracking device does not exist.');
  }

  return device;
};

export const ensureDistrictBelongsToProvince = (district, provinceId) => {
  if (district.provinceId !== provinceId) {
    throw validationError('District does not belong to the specified province.');
  }
};

export const ensureStationMatchesRegion = (station, { provinceId, districtId }) => {
  if (provinceId && station.provinceId !== provinceId) {
    throw validationError('Police station does not belong to the specified province.');
  }

  if (districtId && station.districtId !== districtId) {
    throw validationError('Police station does not belong to the specified district.');
  }
};

export const ensureDriverMatchesRegion = (driver, { provinceId, districtId, stationId }) => {
  if (provinceId && driver.provinceId && driver.provinceId !== provinceId) {
    throw validationError('Driver does not belong to the specified province.');
  }

  if (districtId && driver.districtId && driver.districtId !== districtId) {
    throw validationError('Driver does not belong to the specified district.');
  }

  if (stationId && driver.stationId && driver.stationId !== stationId) {
    throw validationError('Driver does not belong to the specified station.');
  }
};

export const ensureUserRoleScope = ({ role, provinceId, districtId, stationId }) => {
  if (role === 'HQ_ADMIN' && (provinceId || districtId || stationId)) {
    throw validationError('HQ_ADMIN users must not be assigned to a province, district, or station.');
  }

  if (role === 'PROVINCIAL_ADMIN' && !provinceId) {
    throw validationError('PROVINCIAL_ADMIN users must be assigned to a province.');
  }

  if (role === 'PROVINCIAL_ADMIN' && (districtId || stationId)) {
    throw validationError('PROVINCIAL_ADMIN users must not be assigned to a district or station.');
  }

  if (role === 'DISTRICT_OFFICER' && (!provinceId || !districtId)) {
    throw validationError('DISTRICT_OFFICER users must be assigned to a province and district.');
  }

  if (role === 'DISTRICT_OFFICER' && stationId) {
    throw validationError('DISTRICT_OFFICER users must not be assigned to a station.');
  }

  if (role === 'STATION_OFFICER' && (!provinceId || !districtId || !stationId)) {
    throw validationError('STATION_OFFICER users must be assigned to a province, district, and station.');
  }
};
