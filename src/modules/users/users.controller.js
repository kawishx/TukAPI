import * as usersService from './users.service.js';
import { sendCachedSuccess, sendSuccess } from '../../utils/apiResponse.js';

export const listUsers = async (req, res) => {
  const result = await usersService.listUsers(req.query, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Authorized users fetched successfully.',
    data: result.items,
    meta: result.meta,
    lastModified: result.lastModified,
  });
};

export const getUserById = async (req, res) => {
  const result = await usersService.getUserById(req.params.id, req.user);

  return sendCachedSuccess(req, res, {
    message: 'Authorized user fetched successfully.',
    data: result.data,
    lastModified: result.lastModified,
  });
};

export const createUser = async (req, res) => {
  const result = await usersService.createUser(req.body, req.user);

  res.location(`${req.baseUrl}/${result.id}`);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Authorized user created successfully.',
    data: result,
  });
};

export const updateUser = async (req, res) => {
  const result = await usersService.updateUser(req.params.id, req.body, req.user);

  return sendSuccess(res, {
    message: 'Authorized user updated successfully.',
    data: result,
  });
};
