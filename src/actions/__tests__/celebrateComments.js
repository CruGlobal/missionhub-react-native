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

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({ celebrateComments });
});

describe('getCelebrateCommentsNextPage', () => {
  function subject() {
    return store.dispatch(getCelebrateCommentsNextPage(event));
  }

  it('should call selector', async () => {
    await subject();

    expect(celebrateCommentsSelector).toHaveBeenCalledWith(
      { celebrateComments },
      { eventId: event.id },
    );
  });

  it('should callApi with next page', async () => {
    await subject();

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CELEBRATE_COMMENTS, {
      orgId: event.organization.id,
      eventId: event.id,
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * comment.pagination.page,
      },
    });
  });

  it('should return api response', async () => {
    expect(await subject()).toEqual(callApiResponse);
  });
});

describe('reloadCelebrateComments', () => {
  function subject() {
    return store.dispatch(reloadCelebrateComments(event));
  }

  it('should callApi with no page', async () => {
    await subject();

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CELEBRATE_COMMENTS, {
      orgId: event.organization.id,
      eventId: event.id,
    });
  });

  it('should return api response', async () => {
    expect(await subject()).toEqual(callApiResponse);
  });
});
