import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getGroupChallengeFeed,
  reloadGroupChallengeFeed,
  completeChallenge,
  joinChallenge,
  createChallenge,
  updateChallenge,
  getChallenge,
} from '../challenges';
import { trackActionWithoutData } from '../analytics';
import { reloadGroupCelebrateFeed } from '../celebration';
import callApi, { REQUESTS } from '../api';
import {
  DEFAULT_PAGE_LIMIT,
  RESET_CHALLENGE_PAGINATION,
  UPDATE_CHALLENGE,
  ACTIONS,
} from '../../constants';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import * as common from '../../utils/common';
import { navigatePush } from '../navigation';

jest.mock('../api');
jest.mock('../navigation');
jest.mock('../celebration');
jest.mock('../analytics');

const fakeDate = '2018-09-06T14:13:21Z';
common.formatApiDate = jest.fn(() => fakeDate);

const orgId = '123';

const apiResult = { type: 'done' };
const navigateResult = { type: 'has navigated' };
const celebrateResult = { type: 'reloaded celebrate feed' };
const resetResult = { type: RESET_CHALLENGE_PAGINATION, orgId };
const trackActionResult = { type: 'track action' };

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
  jest.clearAllMocks();
  store = createStore(defaultStore);
  callApi.mockReturnValue(apiResult);
  navigatePush.mockReturnValue(navigateResult);
  reloadGroupCelebrateFeed.mockReturnValue(celebrateResult);
  trackActionWithoutData.mockReturnValue(trackActionResult);
});

describe('getGroupChallengeFeed', () => {
  it('gets a page of challenge feed', () => {
    store.dispatch(getGroupChallengeFeed(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CHALLENGE_FEED, {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * currentPage,
      },
      filters: { organization_ids: orgId },
      sort: '-active,-created_at',
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

    store.dispatch(getGroupChallengeFeed(orgId));

    expect(callApi).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
});

describe('reloadGroupChallengeFeed', () => {
  it('reload a challenge feed', () => {
    store.dispatch(reloadGroupChallengeFeed(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CHALLENGE_FEED, {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * 0,
      },
      filters: { organization_ids: orgId },
      sort: '-active,-created_at',
    });
    expect(store.getActions()).toEqual([resetResult, apiResult]);
  });
});

describe('completeChallenge', () => {
  const item = { id: '1' };

  it('completes a challenge', async () => {
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
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CHALLENGE_COMPLETED,
    );
    expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(orgId);
    expect(store.getActions()).toEqual([
      apiResult,
      navigateResult,
      trackActionResult,
      resetResult,
      apiResult,
      celebrateResult,
    ]);
  });
});

describe('joinChallenge', () => {
  const item = { id: '1' };

  it('joins a challenge', async () => {
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
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CHALLENGE_JOINED,
    );
    expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(orgId);
    expect(store.getActions()).toEqual([
      apiResult,
      navigateResult,
      trackActionResult,
      resetResult,
      apiResult,
      celebrateResult,
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
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CHALLENGE_CREATED,
    );
    expect(store.getActions()).toEqual([
      apiResult,
      trackActionResult,
      resetResult,
      apiResult,
    ]);
  });
});

describe('updateChallenge', () => {
  const challenge_id = '1';
  const responseOrganization = { id: orgId };
  const responseTitle = 'response title';
  const responseDate = '2018-11-19T14:13:21Z';
  const updateChallengeResult = {
    type: 'api response',
    response: {
      id: challenge_id,
      organization: responseOrganization,
      title: responseTitle,
      end_date: responseDate,
      accepted_community_challenges: [],
    },
  };

  beforeEach(() => {
    callApi.mockReturnValue(updateChallengeResult);
  });

  const updateAction = {
    type: UPDATE_CHALLENGE,
    challenge: {
      id: challenge_id,
      organization: responseOrganization,
      title: responseTitle,
      end_date: responseDate,
    },
  };

  it('updates a challenge with a new title', async () => {
    const item = {
      id: challenge_id,
      title: 'Challenge Title',
    };
    await store.dispatch(updateChallenge(item, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_GROUP_CHALLENGE,
      { challenge_id: item.id },
      {
        data: {
          attributes: {
            title: item.title,
          },
        },
      },
    );
    expect(store.getActions()).toEqual([updateChallengeResult, updateAction]);
  });
  it('updates a challenge with a new date', async () => {
    const item = {
      id: challenge_id,
      date: fakeDate,
    };
    await store.dispatch(updateChallenge(item, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_GROUP_CHALLENGE,
      { challenge_id: item.id },
      {
        data: {
          attributes: {
            end_date: fakeDate,
          },
        },
      },
    );
    expect(store.getActions()).toEqual([updateChallengeResult, updateAction]);
  });
  it('updates a challenge with a new title and date', async () => {
    const item = {
      id: challenge_id,
      title: 'Challenge Title',
      date: fakeDate,
    };
    await store.dispatch(updateChallenge(item, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_GROUP_CHALLENGE,
      { challenge_id: item.id },
      {
        data: {
          attributes: {
            title: item.title,
            end_date: fakeDate,
          },
        },
      },
    );
    expect(store.getActions()).toEqual([updateChallengeResult, updateAction]);
  });
});

describe('getChallenge', () => {
  const challenge_id = '111';
  const getChallengeResult = {
    type: 'api response',
    response: {
      id: challenge_id,
      accepted_community_challenges: [],
    },
  };

  beforeEach(() => {
    callApi.mockReturnValue(getChallengeResult);
  });

  it('gets challenge by id', async () => {
    await store.dispatch(getChallenge(challenge_id));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CHALLENGE, {
      challenge_id,
      include:
        'accepted_community_challenges.person.first_name,accepted_community_challenges.person.last_name',
    });
    expect(store.getActions()).toEqual([
      getChallengeResult,
      {
        type: UPDATE_CHALLENGE,
        challenge: getChallengeResult.response,
      },
    ]);
  });
});
