export const parsePagination = (query, defaults = {}) => {
  const defaultPage = defaults.page ?? 1;
  const defaultLimit = defaults.limit ?? 20;

  const page = Number(query.page ?? defaultPage);
  const limit = Number(query.limit ?? defaultLimit);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
};

export const buildPaginationMeta = ({ page, limit, totalItems }) => ({
  page,
  limit,
  totalItems,
  totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
});

