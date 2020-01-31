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
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import { trackActionWithoutData } from '../analytics';
import { ACTIONS } from '../../constants';
import { CELEBRATE_ITEM_FRAGMENT } from '../../components/CelebrateItem/queries';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem } from '../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';
import { mockFragment } from '../../../testUtils/apolloMockClient';

jest.mock('../api');
jest.mock('../../selectors/celebrateComments');
jest.mock('../analytics');

const orgId = '645654';
const eventId = '80890';
const event = mockFragment<CelebrateItem>(CELEBRATE_ITEM_FRAGMENT);

const comment = { pagination: { page: 2, hasNextPage: true } };
const callApiResponse = { result: 'hello world' };
const celebrateComments = { someProp: 'asdfasdfasdf' };
const baseQuery = { orgId, eventId: event.id };
const me = { id: 'myId' };
const include = 'organization_celebration_item,person';
const trackActionResult = { type: 'tracked action' };

const mockStore = configureStore([thunk]);
let store: MockStore;

beforeEach(() => {
  store = mockStore({ auth: { person: me }, celebrateComments });
  (callApi as jest.Mock).mockReturnValue(callApiResponse);
  ((celebrateCommentsSelector as unknown) as jest.Mock).mockReturnValue(
    comment,
  );
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
});

describe('getCelebrateCommentsNextPage', () => {
  let response;

  beforeEach(
    () =>
      (response = store.dispatch(
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
    // @ts-ignore
    expect(response).toEqual(callApiResponse);
  });
});

describe('reloadCelebrateComments', () => {
  // @ts-ignore
  let response;

  // @ts-ignore
  beforeEach(() => (response = store.dispatch(reloadCelebrateComments(event))));

  it('should callApi with no page', () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CELEBRATE_COMMENTS, {
      ...baseQuery,
      include,
    });
  });

  it('should return api response', () => {
    // @ts-ignore
    expect(response).toEqual(callApiResponse);
  });
});

describe('createCelebrateComment', () => {
  const content = 'this is a comment';
  // @ts-ignore
  let response;

  beforeEach(
    async () =>
      // @ts-ignore
      (response = await store.dispatch(createCelebrateComment(event, content))),
  );

  it('should callApi with no page', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_CELEBRATE_COMMENT,
      baseQuery,
      { data: { attributes: { content } } },
    );
  });

  it('should return api response', () => {
    // @ts-ignore
    expect(response).toEqual(callApiResponse);
  });

  it('should track action', () => {
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CELEBRATE_COMMENT_ADDED,
    );
    // @ts-ignore
    expect(store.getActions()).toEqual([trackActionResult]);
  });
});

describe('deleteCelebrateComment', () => {
  const item = { id: 'comment1' };
  // @ts-ignore
  let response;

  beforeEach(
    async () =>
      // @ts-ignore
      (response = await store.dispatch(
        deleteCelebrateComment(event.organization.id, event, item),
      )),
  );

  it('should callApi for delete', () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.DELETE_CELEBRATE_COMMENT, {
      ...baseQuery,
      commentId: item.id,
    });
  });

  it('should return api response', () => {
    // @ts-ignore
    expect(response).toEqual(callApiResponse);
  });

  it('should track action', () => {
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CELEBRATE_COMMENT_DELETED,
    );
    // @ts-ignore
    expect(store.getActions()).toEqual([trackActionResult]);
  });
});

describe('updateCelebrateComment', () => {
  const item = { id: 'comment1', organization_celebration_item: event };
  const text = 'text';
  // @ts-ignore
  let response;

  beforeEach(
    async () =>
      // @ts-ignore
      (response = await store.dispatch(updateCelebrateComment(item, text))),
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
    // @ts-ignore
    expect(response).toEqual(callApiResponse);
  });

  it('should track action', () => {
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CELEBRATE_COMMENT_EDITED,
    );
    // @ts-ignore
    expect(store.getActions()).toEqual([trackActionResult]);
  });
});

it('resetCelebrateEditingComment', () => {
  expect(resetCelebrateEditingComment()).toEqual({
    type: RESET_CELEBRATE_EDITING_COMMENT,
  });
});

it('setCelebrateEditingComment', () => {
  const comment = { id: 'test' };
  // @ts-ignore
  store.dispatch(setCelebrateEditingComment(comment.id));
  // @ts-ignore
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
