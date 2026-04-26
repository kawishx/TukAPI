import * as usersRepository from './users.repository.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

export const listUsers = async (query) => {
  const options = buildListOptions(query);
  const result = await usersRepository.findMany(options);

  return {
    items: result.items,
    meta: buildPaginationMeta({
      page: options.page,
      limit: options.limit,
      totalItems: result.totalItems,
    }),
    lastModified: result.lastModified,
  };
};

export const getUserById = async (id) => usersRepository.findById(id);
export const createUser = async (payload) => usersRepository.create(payload);
export const updateUser = async (id, payload) => usersRepository.update(id, payload);

