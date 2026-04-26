import * as districtsService from './districts.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const listDistricts = async (req, res) => {
  const result = await districtsService.listDistricts(req.query);

  return sendCachedSuccess(req, res, {
    message: 'Districts fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const getDistrictById = async (req, res) => {
  const result = await districtsService.getDistrictById(req.params.id);

  return sendCachedSuccess(req, res, {
    message: 'District fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const createDistrict = async (req, res) => {
  const result = await districtsService.createDistrict(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'District scaffold record created successfully.',
    data: result,
  });
};

export const updateDistrict = async (req, res) => {
  const result = await districtsService.updateDistrict(req.params.id, req.body);

  return sendSuccess(res, {
    message: 'District scaffold record updated successfully.',
    data: result,
  });
};

