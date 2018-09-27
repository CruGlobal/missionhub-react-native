import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getGroupChallengeFeed,
  reloadGroupChallengeFeed,
  completeChallenge,
  joinChallenge,
  createChallenge,
  updateChallenge,
} from '../../src/actions/challenges';
import callApi, { REQUESTS } from '../../src/actions/api';
import {
  DEFAULT_PAGE_LIMIT,
  RESET_CHALLENGE_PAGINATION,
} from '../../src/constants';
import { CELEBRATION_SCREEN } from '../../src/containers/CelebrationScreen';
import * as common from '../../src/utils/common';
import { navigatePush } from '../../src/actions/navigation';

jest.mock('../../src/actions/api');
jest.mock('../../src/actions/navigation');

const fakeDate = '2018-09-06T14:13:21Z';
common.formatApiDate = jest.fn(() => fakeDate);

const orgId = '123';

const apiResult = { type: 'done' };
const navigateResult = { type: 'has navigated' };
const resetResult = { type: RESET_CHALLENGE_PAGINATION, orgId };

const createStore = configureStore([thunk]);
let store;

const currentPage = 0;

const defaultStore = {
  organizations: {
    all: [
      {
        id: orgId,
        challengePagination: {
          hasNextPage: true,
          page: currentPage,
        },
      },
    ],
  },
};

beforeEach(() => {
  callApi.mockClear();
  store = createStore(defaultStore);
});

describe('getGroupChallengeFeed', () => {
  it('gets a page of challenge feed', () => {
    callApi.mockReturnValue(apiResult);

    store.dispatch(getGroupChallengeFeed(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CHALLENGE_FEED, {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * currentPage,
      },
      filters: { organization_ids: orgId },
    });
    expect(store.getActions()).toEqual([apiResult]);
  });

  it('does not get challenge items if there is no next page', () => {
    store = createStore({
      organizations: {
        all: [
          {
            id: orgId,
            challengePagination: {
              hasNextPage: false,
              page: currentPage,
            },
          },
        ],
      },
    });

    callApi.mockReturnValue(apiResult);

    store.dispatch(getGroupChallengeFeed(orgId));

    expect(callApi).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
});

describe('reloadGroupChallengeFeed', () => {
  it('reload a challenge feed', () => {
    callApi.mockReturnValue(apiResult);

    store.dispatch(reloadGroupChallengeFeed(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CHALLENGE_FEED, {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * 0,
      },
      filters: { organization_ids: orgId },
    });
    expect(store.getActions()).toEqual([resetResult, apiResult]);
  });
});

describe('completeChallenge', () => {
  const item = { id: '1' };

  it('completes a challenge', async () => {
    callApi.mockReturnValue(apiResult);
    navigatePush.mockReturnValue(navigateResult);

    await store.dispatch(completeChallenge(item, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.COMPLETE_GROUP_CHALLENGE,
      {
        challengeId: item.id,
      },
      {
        data: {
          attributes: {
            completed_at: fakeDate,
          },
        },
      },
    );
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
      onComplete: expect.anything(),
    });
    expect(store.getActions()).toEqual([
      apiResult,
      navigateResult,
      resetResult,
      apiResult,
    ]);
  });
});

describe('joinChallenge', () => {
  const item = { id: '1' };

  it('joins a challenge', async () => {
    callApi.mockReturnValue(apiResult);

    await store.dispatch(joinChallenge(item, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ACCEPT_GROUP_CHALLENGE,
      { challengeId: item.id },
      {
        data: {
          attributes: {
            community_challenge_id: item.id,
          },
        },
      },
    );
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
      onComplete: expect.anything(),
      gifId: 0,
    });
    expect(store.getActions()).toEqual([
      apiResult,
      navigateResult,
      resetResult,
      apiResult,
    ]);
  });
});

describe('createChallenge', () => {
  const item = {
    organization_id: orgId,
    title: 'Challenge Title',
    date: fakeDate,
  };

  it('creates a challenge', async () => {
    callApi.mockReturnValue(apiResult);

    await store.dispatch(createChallenge(item, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_GROUP_CHALLENGE,
      {},
      {
        data: {
          attributes: {
            title: item.title,
            end_date: item.date,
            organization_id: orgId,
          },
        },
      },
    );
    expect(store.getActions()).toEqual([apiResult, resetResult, apiResult]);
  });
});

describe('updateChallenge', () => {
  it('updates a challenge with a new title', async () => {
    const item = {
      id: '1',
      title: 'Challenge Title',
    };

    callApi.mockReturnValue(apiResult);

    await store.dispatch(updateChallenge(item, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_GROUP_CHALLENGE,
      { challengeId: item.id },
      {
        data: {
          attributes: {
            title: item.title,
          },
        },
      },
    );
    expect(store.getActions()).toEqual([apiResult, resetResult, apiResult]);
  });
  it('updates a challenge with a new date', async () => {
    const item = {
      id: '1',
      date: fakeDate,
    };

    callApi.mockReturnValue(apiResult);

    await store.dispatch(updateChallenge(item, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_GROUP_CHALLENGE,
      { challengeId: item.id },
      {
        data: {
          attributes: {
            end_date: fakeDate,
          },
        },
      },
    );
    expect(store.getActions()).toEqual([apiResult, resetResult, apiResult]);
  });
  it('updates a challenge with a new title and date', async () => {
    const item = {
      id: '1',
      title: 'Challenge Title',
      date: fakeDate,
    };

    callApi.mockReturnValue(apiResult);

    await store.dispatch(updateChallenge(item, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_GROUP_CHALLENGE,
      { challengeId: item.id },
      {
        data: {
          attributes: {
            title: item.title,
            end_date: fakeDate,
          },
        },
      },
    );
    expect(store.getActions()).toEqual([apiResult, resetResult, apiResult]);
  });
});
