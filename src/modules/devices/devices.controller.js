import * as devicesService from './devices.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const listDevices = async (req, res) => {
  const result = await devicesService.listDevices(req.query, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Tracking devices fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const getDeviceById = async (req, res) => {
  const result = await devicesService.getDeviceById(req.params.id, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Tracking device fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const createDevice = async (req, res) => {
  const result = await devicesService.createDevice(req.body, req.user);

  res.location(`${req.baseUrl}/${result.id}`);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Tracking device created successfully.',
    data: result,
  });
};

export const updateDevice = async (req, res) => {
  const result = await devicesService.updateDevice(req.params.id, req.body, req.user);

  return sendSuccess(res, {
    message: 'Tracking device updated successfully.',
    data: result,
  });
};
