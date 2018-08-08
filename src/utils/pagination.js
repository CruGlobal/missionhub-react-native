import { DEFAULT_PAGE_LIMIT } from '../constants';

export const buildUpdatedPagination = (meta, previousPagination) => {
  const { total } = meta;
  const { page } = previousPagination;

  const hasMore = total > page * DEFAULT_PAGE_LIMIT;
  const updated = { page: page + 1, hasMore };

  return updated;
};
