export const parseSorting = (query, defaults = {}) => {
  const sortBy = query.sortBy ?? defaults.sortBy ?? 'createdAt';
  const sortOrder = query.sortOrder ?? defaults.sortOrder ?? 'desc';

  return {
    sortBy,
    sortOrder,
    orderBy: {
      [sortBy]: sortOrder,
    },
  };
};

