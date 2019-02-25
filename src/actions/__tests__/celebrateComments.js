import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DEFAULT_PAGE_LIMIT } from '../../constants';
import {
  getCelebrateCommentsNextPage,
  reloadCelebrateComments,
  createCelebrateComment,
} from '../celebrateComments';
import callApi, { REQUESTS } from '../api';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';

jest.mock('../api');
jest.mock('../../selectors/celebrateComments');

const event = { id: '80890', organization: { id: '645654' } };
const comment = { pagination: { page: 2, hasNextPage: true } };
const callApiResponse = { result: 'hello world' };
const celebrateComments = { someProp: 'asdfasdfasdf' };
const baseQuery = {
  orgId: event.organization.id,
  eventId: event.id,
};

const mockStore = configureStore([thunk]);
let store;

callApi.mockReturnValue(() => callApiResponse);
celebrateCommentsSelector.mockReturnValue(comment);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({ celebrateComments });
});

describe('getCelebrateCommentsNextPage', () => {
  let response;

  beforeEach(() =>
    (response = store.dispatch(getCelebrateCommentsNextPage(event))));

  it('should call selector', () => {
    expect(celebrateCommentsSelector).toHaveBeenCalledWith(
      { celebrateComments },
      { eventId: event.id },
    );
  });

  it('should callApi with next page', () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CELEBRATE_COMMENTS, {
      ...baseQuery,
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * comment.pagination.page,
      },
    });
  });

  it('should return api response', () => {
    expect(response).toEqual(callApiResponse);
  });
});

describe('reloadCelebrateComments', () => {
  let response;

  beforeEach(() => (response = store.dispatch(reloadCelebrateComments(event))));

  it('should callApi with no page', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_CELEBRATE_COMMENTS,
      baseQuery,
    );
  });

  it('should return api response', () => {
    expect(response).toEqual(callApiResponse);
  });
});

describe('createCelebrateComment', () => {
  const content = 'this is a comment';
  let response;

  beforeEach(() =>
    (response = store.dispatch(createCelebrateComment(event, content))));

  it('should callApi with no page', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_CELEBRATE_COMMENT,
      baseQuery,
      { data: { attributes: { content } } },
    );
  });

  it('should return api response', () => {
    expect(response).toEqual(callApiResponse);
  });
});
