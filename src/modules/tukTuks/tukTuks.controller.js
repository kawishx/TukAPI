import * as tukTuksService from './tukTuks.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const listTukTuks = async (req, res) => {
  const result = await tukTuksService.listTukTuks(req.query);

  return sendCachedSuccess(req, res, {
    message: 'Tuk-tuks fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const getTukTukById = async (req, res) => {
  const result = await tukTuksService.getTukTukById(req.params.id);

  return sendCachedSuccess(req, res, {
    message: 'Tuk-tuk fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const createTukTuk = async (req, res) => {
  const result = await tukTuksService.createTukTuk(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Tuk-tuk scaffold record created successfully.',
    data: result,
  });
};

export const updateTukTuk = async (req, res) => {
  const result = await tukTuksService.updateTukTuk(req.params.id, req.body);

  return sendSuccess(res, {
    message: 'Tuk-tuk scaffold record updated successfully.',
    data: result,
  });
};

