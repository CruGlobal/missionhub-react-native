import {
  getGroupCelebrateFeed,
  getGroupCelebrateNextPage,
} from '../../src/actions/celebration';
import callApi, { REQUESTS } from '../../src/actions/api';

beforeEach(() => {
  callApi.mockClear();
  store = mockStore();
});

describe('getGroupCelebrateFeed', () => {
  it('gets celebrate feed with no filters', () => {});
});
