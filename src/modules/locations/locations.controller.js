import * as locationsService from './locations.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const createLocationPing = async (req, res) => {
  const result = await locationsService.createLocationPing(req.body, req.device, {
    ip: req.ip,
    path: req.originalUrl,
    method: req.method,
    userAgent: req.get('user-agent'),
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Location ping accepted successfully.',
    data: result,
  });
};

export const listLiveLocations = async (req, res) => {
  const result = await locationsService.listLiveLocations(req.query, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Current live locations fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const getLiveLocation = async (req, res) => {
  const result = await locationsService.getLiveLocation(req.params.tukTukId, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Last known live location fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const getLocationHistory = async (req, res) => {
  const result = await locationsService.getLocationHistory(req.query, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Movement history fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};
