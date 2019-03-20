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
  reportComment,
  ignoreReportComment,
  getReportedComments,
} from '../celebrateComments';
import callApi, { REQUESTS } from '../api';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import { trackActionWithoutData } from '../analytics';
import { ACTIONS } from '../../constants';
import * as common from '../../utils/common';

jest.mock('../api');
jest.mock('../../selectors/celebrateComments');
jest.mock('../analytics');

const orgId = '645654';
const event = { id: '80890', organization: { id: orgId } };
const comment = { pagination: { page: 2, hasNextPage: true } };
const callApiResponse = { result: 'hello world' };
const celebrateComments = { someProp: 'asdfasdfasdf' };
const baseQuery = { orgId, eventId: event.id };
const me = { id: 'myId' };
const include = 'organization_celebration_item,person';
const trackActionResult = { type: 'tracked action' };

const mockStore = configureStore([thunk]);
let store;

callApi.mockReturnValue(() => callApiResponse);
celebrateCommentsSelector.mockReturnValue(comment);
trackActionWithoutData.mockReturnValue(trackActionResult);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({ auth: { person: me }, celebrateComments });
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

  beforeEach(async () =>
    (response = await store.dispatch(createCelebrateComment(event, content))));

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

  it('should track action', () => {
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CELEBRATE_COMMENT_ADDED,
    );
    expect(store.getActions()).toEqual([trackActionResult]);
  });
});

describe('deleteCelebrateComment', () => {
  const item = { id: 'comment1' };
  let response;

  beforeEach(async () =>
    (response = await store.dispatch(
      deleteCelebrateComment(event.organization.id, event, item),
    )));

  it('should callApi for delete', () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.DELETE_CELEBRATE_COMMENT, {
      ...baseQuery,
      commentId: item.id,
    });
  });

  it('should return api response', () => {
    expect(response).toEqual(callApiResponse);
  });

  it('should track action', () => {
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CELEBRATE_COMMENT_DELETED,
    );
    expect(store.getActions()).toEqual([trackActionResult]);
  });
});

describe('updateCelebrateComment', () => {
  const item = { id: 'comment1', organization_celebration_item: event };
  const text = 'text';
  let response;

  beforeEach(async () =>
    (response = await store.dispatch(updateCelebrateComment(item, text))));

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

  it('should track action', () => {
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CELEBRATE_COMMENT_EDITED,
    );
    expect(store.getActions()).toEqual([trackActionResult]);
  });
});

describe('report comments', () => {
  const item = { id: 'comment1' };
  it('should callApi for report', () => {
    const response = store.dispatch(reportComment(orgId, item));
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_REPORT_COMMENT,
      { orgId },
      { data: { attributes: { comment_id: item.id, person_id: me.id } } },
    );
    expect(response).toEqual(callApiResponse);
  });
  it('should callApi for ignore', () => {
    const fakeDate = '2018-09-06T14:13:21Z';
    common.formatApiDate = jest.fn(() => fakeDate);
    const response = store.dispatch(ignoreReportComment(orgId, item.id));
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_REPORT_COMMENT,
      { orgId, reportCommentId: item.id },
      { data: { attributes: { ignored_at: fakeDate } } },
    );
    expect(response).toEqual(callApiResponse);
  });
  it('should callApi for get reported comments', () => {
    const response = store.dispatch(getReportedComments(orgId));
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_REPORTED_COMMENTS, {
      orgId,
      filters: { ignored: false },
      include: 'comment,comment.person,person',
    });
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
  store.dispatch(setCelebrateEditingComment(comment.id));
  expect(store.getActions()).toEqual([
    {
      type: RESET_CELEBRATE_EDITING_COMMENT,
    },
    {
      type: SET_CELEBRATE_EDITING_COMMENT,
      commentId: comment.id,
    },
  ]);
});
