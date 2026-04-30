import * as districtsService from './districts.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const listDistricts = async (req, res) => {
  const result = await districtsService.listDistricts(req.query, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Districts fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const getDistrictById = async (req, res) => {
  const result = await districtsService.getDistrictById(req.params.id, req.user);

  return sendCachedSuccess(req, res, {
    message: 'District fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const createDistrict = (_req, res) =>
  sendSuccess(res, {
    statusCode: 405,
    message: 'Districts are read-only reference data.',
  });

export const updateDistrict = (_req, res) =>
  sendSuccess(res, {
    statusCode: 405,
    message: 'Districts are read-only reference data.',
  });
