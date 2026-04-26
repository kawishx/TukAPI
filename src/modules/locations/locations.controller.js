import * as locationsService from './locations.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const createLocationPing = async (req, res) => {
  const result = await locationsService.createLocationPing(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Location ping scaffold record created successfully.',
    data: result,
  });
};

export const getLiveLocation = async (req, res) => {
  const result = await locationsService.getLiveLocation(req.params.tukTukId);

  return sendCachedSuccess(req, res, {
    message: 'Last known live location fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const getLocationHistory = async (req, res) => {
  const result = await locationsService.getLocationHistory(req.query);

  return sendCachedSuccess(req, res, {
    message: 'Movement history fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

