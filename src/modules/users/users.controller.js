import * as usersService from './users.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const listUsers = async (req, res) => {
  const result = await usersService.listUsers(req.query);

  return sendCachedSuccess(req, res, {
    message: 'Authorized users fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const getUserById = async (req, res) => {
  const result = await usersService.getUserById(req.params.id);

  return sendCachedSuccess(req, res, {
    message: 'Authorized user fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const createUser = async (req, res) => {
  const result = await usersService.createUser(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Authorized user scaffold record created successfully.',
    data: result,
  });
};

export const updateUser = async (req, res) => {
  const result = await usersService.updateUser(req.params.id, req.body);

  return sendSuccess(res, {
    message: 'Authorized user scaffold record updated successfully.',
    data: result,
  });
};

