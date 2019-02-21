import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DEFAULT_PAGE_LIMIT } from '../../constants';
import {
  getCelebrateCommentsNextPage,
  reloadCelebrateComments,
} from '../celebrateComments';
import callApi, { REQUESTS } from '../api';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';

jest.mock('../api');
jest.mock('../../selectors/celebrateComments');

const event = { id: '80890', organization: { id: '645654' } };
const comment = { pagination: { page: 2, hasNextPage: true } };
const callApiResponse = { result: 'hello world' };
const celebrateComments = { someProp: 'asdfasdfasdf' };

const mockStore = configureStore([thunk]);
let store;

callApi.mockReturnValue(() => callApiResponse);
celebrateCommentsSelector.mockReturnValue(comment);

beforeEach(() => (store = mockStore({ celebrateComments })));

describe('getCelebrateCommentsNextPage', () => {
  it('should send request with next page', async () => {
    const result = await store.dispatch(getCelebrateCommentsNextPage(event));

    expect(celebrateCommentsSelector).toHaveBeenCalledWith(
      { celebrateComments },
      { eventId: event.id },
    );
    expect(result).toEqual(callApiResponse);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CELEBRATE_COMMENTS, {
      orgId: event.organization.id,
      eventId: event.id,
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * comment.pagination.page,
      },
    });
  });
});

describe('reloadCelebrateComments', () => {
  it('should send request with no page', async () => {
    const result = await store.dispatch(reloadCelebrateComments(event));

    expect(result).toEqual(callApiResponse);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CELEBRATE_COMMENTS, {
      orgId: event.organization.id,
      eventId: event.id,
    });
  });
});
