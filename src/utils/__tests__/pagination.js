import { buildUpdatedPagination } from '../pagination';
import { DEFAULT_PAGE_LIMIT } from '../../constants';

describe('building pagination', () => {
  it('should increment page by 1 and not have more', () => {
    const meta = {
      total: DEFAULT_PAGE_LIMIT - 2,
    };
    const pagination = {
      page: 0,
      hasMore: true,
    };

    expect(buildUpdatedPagination(meta, pagination)).toEqual({
      page: 1,
      hasMore: false,
    });
  });

  it('should increment page by 1 and have more', () => {
    const meta = {
      total: DEFAULT_PAGE_LIMIT + 2,
    };
    const pagination = {
      page: 0,
      hasMore: true,
    };

    expect(buildUpdatedPagination(meta, pagination)).toEqual({
      page: 1,
      hasMore: true,
    });
  });
});
