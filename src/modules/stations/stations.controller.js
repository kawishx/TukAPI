import * as stationsService from './stations.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const listStations = async (req, res) => {
  const result = await stationsService.listStations(req.query);

  return sendCachedSuccess(req, res, {
    message: 'Police stations fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const getStationById = async (req, res) => {
  const result = await stationsService.getStationById(req.params.id);

  return sendCachedSuccess(req, res, {
    message: 'Police station fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const createStation = async (req, res) => {
  const result = await stationsService.createStation(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Police station scaffold record created successfully.',
    data: result,
  });
};

export const updateStation = async (req, res) => {
  const result = await stationsService.updateStation(req.params.id, req.body);

  return sendSuccess(res, {
    message: 'Police station scaffold record updated successfully.',
    data: result,
  });
};

