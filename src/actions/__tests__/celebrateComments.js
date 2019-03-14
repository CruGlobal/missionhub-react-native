import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  DEFAULT_PAGE_LIMIT,
  RESET_CELEBRATE_EDITING_COMMENT,
  SET_CELEBRATE_EDITING_COMMENT,
} from '../../constants';
import {
  getCelebrateCommentsNextPage,
  reloadCelebrateComments,
  createCelebrateComment,
  deleteCelebrateComment,
  updateCelebrateComment,
  resetCelebrateEditingComment,
  setCelebrateEditingComment,
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
const include = 'organization_celebration_item,person';

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
      include,
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
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CELEBRATE_COMMENTS, {
      ...baseQuery,
      include,
    });
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

describe('deleteCelebrateComment', () => {
  const item = { id: 'comment1' };
  let response;

  beforeEach(() =>
    (response = store.dispatch(deleteCelebrateComment(event, item))));

  it('should callApi for delete', () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.DELETE_CELEBRATE_COMMENT, {
      ...baseQuery,
      commentId: item.id,
    });
  });

  it('should return api response', () => {
    expect(response).toEqual(callApiResponse);
  });
});

describe('updateCelebrateComment', () => {
  const item = { id: 'comment1', organization_celebration_item: event };
  const text = 'text';
  let response;

  beforeEach(() =>
    (response = store.dispatch(updateCelebrateComment(item, text))));

  it('should callApi', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_CELEBRATE_COMMENT,
      {
        ...baseQuery,
        commentId: item.id,
      },
      {
        data: {
          attributes: { content: text },
        },
      },
    );
  });

  it('should return api response', () => {
    expect(response).toEqual(callApiResponse);
  });
});

it('resetCelebrateEditingComment', () => {
  expect(resetCelebrateEditingComment()).toEqual({
    type: RESET_CELEBRATE_EDITING_COMMENT,
  });
});

it('setCelebrateEditingComment', () => {
  const comment = { id: 'test' };
  store.dispatch(setCelebrateEditingComment(comment));
  expect(store.getActions()).toEqual([
    {
      type: RESET_CELEBRATE_EDITING_COMMENT,
    },
    {
      type: SET_CELEBRATE_EDITING_COMMENT,
      comment,
    },
  ]);
});
