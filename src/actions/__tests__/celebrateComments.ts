/* eslint-disable @typescript-eslint/no-explicit-any */

import configureStore, { MockStore } from 'redux-mock-store';
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
import { getCelebrateFeed } from '../celebration';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import { trackActionWithoutData } from '../analytics';
import { ACTIONS } from '../../constants';
import { mockFragment } from '../../../testUtils/apolloMockClient';
import { COMMUNITY_FEED_ITEM_FRAGMENT } from '../../components/CommunityFeedItem/queries';
import { CelebrateItem } from '../../components/CommunityFeedItem/__generated__/CelebrateItem';
import { Person } from '../../reducers/people';

jest.mock('../api');
jest.mock('../celebration');
jest.mock('../../selectors/celebrateComments');
jest.mock('../analytics');

const event = mockFragment<CelebrateItem>(COMMUNITY_FEED_ITEM_FRAGMENT);

const orgId = '645654';
const comment = {
  pagination: { page: 2, hasNextPage: true },
};
const baseQuery = { orgId, eventId: event.id };
const me: Person = { id: 'myId' };
const include =
  'organization_celebration_item,person,person.organizational_permissions';

const auth = { person: me };
const celebrateComments = { comments: [comment] };

const callApiResponse = { type: 'call API', result: 'hello world' };
const trackActionResult = { type: 'tracked action' };

const mockStore = configureStore([thunk]);
let store: MockStore;

beforeEach(() => {
  store = mockStore({ auth, celebrateComments });
  (callApi as jest.Mock).mockReturnValue(callApiResponse);
  ((celebrateCommentsSelector as unknown) as jest.Mock).mockReturnValue(
    comment,
  );
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
});

let response: any;

describe('getCelebrateCommentsNextPage', () => {
  beforeEach(
    () =>
      (response = store.dispatch<any>(
        getCelebrateCommentsNextPage(event.id, orgId),
      )),
  );

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
    expect(store.getActions()).toEqual([callApiResponse]);
  });
});

describe('reloadCelebrateComments', () => {
  beforeEach(
    () =>
      (response = store.dispatch<any>(
        reloadCelebrateComments(event.id, orgId),
      )),
  );

  it('should callApi with no page', () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CELEBRATE_COMMENTS, {
      ...baseQuery,
      include,
      page: undefined,
    });
  });

  it('should return api response', () => {
    expect(response).toEqual(callApiResponse);
    expect(store.getActions()).toEqual([callApiResponse]);
  });
});

describe('createCelebrateComment', () => {
  const content = 'this is a comment';

  beforeEach(
    async () =>
      (response = await store.dispatch<any>(
        createCelebrateComment(event.id, orgId, content),
      )),
  );

  it('should callApi with no page', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_CELEBRATE_COMMENT,
      baseQuery,
      { data: { attributes: { content } } },
    );
    expect(getCelebrateFeed).toHaveBeenLastCalledWith(orgId);
  });

  it('should return api response', () => {
    expect(response).toEqual(callApiResponse);
  });

  it('should track action', () => {
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CELEBRATE_COMMENT_ADDED,
    );
    expect(store.getActions()).toEqual([callApiResponse, trackActionResult]);
  });

  it('refreshes celebrate feed', () => {
    expect(getCelebrateFeed).toHaveBeenCalledWith(orgId);
  });
});

describe('deleteCelebrateComment', () => {
  const item = { id: 'comment1' };

  beforeEach(
    async () =>
      (response = await store.dispatch<any>(
        deleteCelebrateComment(orgId, event.id, item.id),
      )),
  );

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
    expect(store.getActions()).toEqual([callApiResponse, trackActionResult]);
  });

  it('refreshes celebrate feed', () => {
    expect(getCelebrateFeed).toHaveBeenCalledWith(orgId);
  });
});

describe('updateCelebrateComment', () => {
  const item = { id: 'comment1', organization_celebration_item: event };
  const text = 'text';

  beforeEach(
    async () =>
      (response = await store.dispatch<any>(
        updateCelebrateComment(event.id, orgId, item.id, text),
      )),
  );

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
    expect(store.getActions()).toEqual([callApiResponse, trackActionResult]);
  });
});

it('resetCelebrateEditingComment', () => {
  expect(resetCelebrateEditingComment()).toEqual({
    type: RESET_CELEBRATE_EDITING_COMMENT,
  });
});

it('setCelebrateEditingComment', () => {
  const comment = { id: 'test' };

  store.dispatch<any>(setCelebrateEditingComment(comment.id));

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
