import { DEFAULT_PAGE_LIMIT } from '../constants';

// @ts-ignore
export const buildUpdatedPagination = (meta, previousPagination) => {
  const { total } = meta;
  const { page } = previousPagination;
  const nextPage = page + 1;

  const hasMore = total > nextPage * DEFAULT_PAGE_LIMIT;
  return { page: nextPage, hasMore };
};
