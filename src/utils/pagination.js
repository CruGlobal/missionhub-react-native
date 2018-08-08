import { DEFAULT_PAGE_LIMIT } from '../constants';

export const buildUpdatedPagination = (meta, previousPagination) => {
  const { total } = meta;
  const { page } = previousPagination;
  const nextPage = page + 1;

  const hasMore = total > nextPage * DEFAULT_PAGE_LIMIT;
  const updated = { page: nextPage, hasMore };

  return updated;
};
