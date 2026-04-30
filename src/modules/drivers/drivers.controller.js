import * as driversService from './drivers.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const listDrivers = async (req, res) => {
  const result = await driversService.listDrivers(req.query, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Drivers fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const getDriverById = async (req, res) => {
  const result = await driversService.getDriverById(req.params.id, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Driver fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const createDriver = async (req, res) => {
  const result = await driversService.createDriver(req.body, req.user);

  res.location(`${req.baseUrl}/${result.id}`);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Driver created successfully.',
    data: result,
  });
};

export const updateDriver = async (req, res) => {
  const result = await driversService.updateDriver(req.params.id, req.body, req.user);

  return sendSuccess(res, {
    message: 'Driver updated successfully.',
    data: result,
  });
};
