import * as tukTuksService from './tukTuks.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const listTukTuks = async (req, res) => {
  const result = await tukTuksService.listTukTuks(req.query, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Tuk-tuks fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const getTukTukById = async (req, res) => {
  const result = await tukTuksService.getTukTukById(req.params.id, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Tuk-tuk fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const getTukTukLocationHistory = async (req, res) => {
  const result = await tukTuksService.getTukTukLocationHistory(req.params.id, req.query, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Tuk-tuk movement history fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const createTukTuk = async (req, res) => {
  const result = await tukTuksService.createTukTuk(req.body, req.user);

  res.location(`${req.baseUrl}/${result.id}`);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Tuk-tuk created successfully.',
    data: result,
  });
};

export const updateTukTuk = async (req, res) => {
  const result = await tukTuksService.updateTukTuk(req.params.id, req.body, req.user);

  return sendSuccess(res, {
    message: 'Tuk-tuk updated successfully.',
    data: result,
  });
};
