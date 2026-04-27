import * as provincesService from './provinces.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const listProvinces = async (req, res) => {
  const result = await provincesService.listProvinces(req.query);

  return sendCachedSuccess(req, res, {
    message: 'Provinces fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const getProvinceById = async (req, res) => {
  const result = await provincesService.getProvinceById(req.params.id);

  return sendCachedSuccess(req, res, {
    message: 'Province fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const createProvince = async (req, res) => {
  const result = await provincesService.createProvince(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Province created successfully.',
    data: result,
  });
};

export const updateProvince = async (req, res) => {
  const result = await provincesService.updateProvince(req.params.id, req.body);

  return sendSuccess(res, {
    message: 'Province updated successfully.',
    data: result,
  });
};
