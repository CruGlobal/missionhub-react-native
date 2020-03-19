/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint max-lines: 0 */

import { MockStore } from 'redux-mock-store';

import { createThunkStore } from '../../../testUtils';
import {
  getGroupChallengeFeed,
  reloadGroupChallengeFeed,
  completeChallenge,
  joinChallenge,
  createChallenge,
  updateChallenge,
  getChallenge,
} from '../challenges';
import { getCelebrateFeed } from '../celebration';
import { trackActionWithoutData } from '../analytics';
import { checkNotifications } from '../notifications';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import {
  DEFAULT_PAGE_LIMIT,
  RESET_CHALLENGE_PAGINATION,
  UPDATE_CHALLENGE,
  ACTIONS,
  NOTIFICATION_PROMPT_TYPES,
} from '../../constants';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import * as common from '../../utils/common';
import { navigatePush, navigateBack } from '../navigation';

jest.mock('../api');
jest.mock('../notifications');
jest.mock('../navigation');
jest.mock('../celebration');
jest.mock('../analytics');

const fakeDate = '2018-09-06T14:13:21Z';
((common as unknown) as { formatApiDate: () => void }).formatApiDate = jest.fn(
  () => fakeDate,
);

const orgId = '123';

const apiResult = { type: 'done' };
const navigateResult = { type: 'has navigated' };
const navigateBackResult = { type: 'navigated back' };
const resetResult = { type: RESET_CHALLENGE_PAGINATION, orgId };
const trackActionResult = { type: 'track action' };
const checkNotificationsResult = { type: 'check notifications' };

let store: MockStore;

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
  store = createThunkStore(defaultStore);
  (callApi as jest.Mock).mockReturnValue(apiResult);
  (navigatePush as jest.Mock).mockReturnValue(navigateResult);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (checkNotifications as jest.Mock).mockReturnValue(checkNotificationsResult);
});

describe('getGroupChallengeFeed', () => {
  it('gets a page of challenge feed', () => {
    store.dispatch<any>(getGroupChallengeFeed(orgId));

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
    store = createThunkStore({
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

    store.dispatch<any>(getGroupChallengeFeed(orgId));

    expect(callApi).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
});

describe('reloadGroupChallengeFeed', () => {
  it('reload a challenge feed', () => {
    store.dispatch<any>(reloadGroupChallengeFeed(orgId));

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
    await store.dispatch<any>(completeChallenge(item, orgId));

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
    expect(getCelebrateFeed).toHaveBeenCalledWith(orgId);
    expect(store.getActions()).toEqual([
      apiResult,
      navigateResult,
      trackActionResult,
      resetResult,
      apiResult,
    ]);
  });
});

describe('joinChallenge', () => {
  const item = { id: '1' };

  beforeEach(() => {
    (navigatePush as jest.Mock).mockImplementation((_, { onComplete }) => {
      onComplete && onComplete();
      return navigateResult;
    });
  });

  it('joins a challenge, prompt was shown', async () => {
    (checkNotifications as jest.Mock).mockImplementation((_, callback) => {
      callback({ showedPrompt: true });
      return checkNotificationsResult;
    });

    await store.dispatch<any>(joinChallenge(item, orgId));

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
    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.JOIN_CHALLENGE,
      expect.any(Function),
    );
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
      onComplete: expect.any(Function),
      gifId: 0,
    });
    expect(navigateBack).toHaveBeenCalledWith(2);
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CHALLENGE_JOINED,
    );
    expect(getCelebrateFeed).toHaveBeenCalledWith(orgId);
    expect(store.getActions()).toEqual([
      apiResult,
      trackActionResult,
      resetResult,
      apiResult,
      navigateBackResult,
      navigateResult,
      checkNotificationsResult,
    ]);
  });

  it('joins a challenge, prompt was not shown', async () => {
    (checkNotifications as jest.Mock).mockImplementation((_, callback) => {
      callback({ showedPrompt: false });
      return checkNotificationsResult;
    });

    await store.dispatch<any>(joinChallenge(item, orgId));

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
    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.JOIN_CHALLENGE,
      expect.any(Function),
    );
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
      onComplete: expect.any(Function),
      gifId: 0,
    });
    expect(navigateBack).toHaveBeenCalledWith(1);
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CHALLENGE_JOINED,
    );
    expect(store.getActions()).toEqual([
      apiResult,
      trackActionResult,
      resetResult,
      apiResult,
      navigateBackResult,
      navigateResult,
      checkNotificationsResult,
    ]);
  });
});

describe('createChallenge', () => {
  const item = {
    organization_id: orgId,
    title: 'Challenge Title',
    date: fakeDate,
    details: 'Challenge detail',
  };

  it('creates a challenge', async () => {
    await store.dispatch<any>(createChallenge(item, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_GROUP_CHALLENGE,
      {},
      {
        data: {
          attributes: {
            title: item.title,
            end_date: item.date,
            organization_id: orgId,
            details_markdown: item.details,
          },
        },
      },
    );
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
      onComplete: expect.any(Function),
    });
    (navigatePush as jest.Mock).mock.calls[0][1].onComplete();
    expect(navigateBack).toHaveBeenCalledWith(2);
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CHALLENGE_CREATED,
    );
    expect(store.getActions()).toEqual([
      apiResult,
      navigateResult,
      trackActionResult,
      resetResult,
      apiResult,
      navigateBackResults,
    ]);
  });
});

describe('updateChallenge', () => {
  const challenge_id = '1';
  const responseOrganization = { id: orgId };
  const responseTitle = 'response title';
  const responseDate = '2018-11-19T14:13:21Z';
  const responseDetail = 'New details for challenge';
  const updateChallengeResult = {
    type: 'api response',
    response: {
      id: challenge_id,
      organization: responseOrganization,
      title: responseTitle,
      end_date: responseDate,
      accepted_community_challenges: [],
      details_markdown: responseDetail,
    },
  };

  beforeEach(() => {
    (callApi as jest.Mock).mockReturnValue(updateChallengeResult);
  });

  const updateAction = {
    type: UPDATE_CHALLENGE,
    challenge: {
      id: challenge_id,
      organization: responseOrganization,
      title: responseTitle,
      end_date: responseDate,
      details_markdown: responseDetail,
    },
  };

  it('updates a challenge with a new title', async () => {
    const item = {
      id: challenge_id,
      title: 'Challenge Title',
    };
    await store.dispatch<any>(updateChallenge(item));

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
    await store.dispatch<any>(updateChallenge(item));

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
  it('updates a challenge with a new detail', async () => {
    const newDetail = 'Cool new detail';
    const item = {
      id: challenge_id,
      details: newDetail,
    };
    // @ts-ignore
    await store.dispatch(updateChallenge(item, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_GROUP_CHALLENGE,
      { challenge_id: item.id },
      {
        data: {
          attributes: {
            details_markdown: item.details,
          },
        },
      },
    );
    // @ts-ignore
    expect(store.getActions()).toEqual([updateChallengeResult, updateAction]);
  });
  it('updates a challenge with a new title, date, and detail', async () => {
    const item = {
      id: challenge_id,
      title: 'Challenge Title',
      date: fakeDate,
      details: 'Cool new detail',
    };
    await store.dispatch<any>(updateChallenge(item));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_GROUP_CHALLENGE,
      { challenge_id: item.id },
      {
        data: {
          attributes: {
            title: item.title,
            end_date: fakeDate,
            details_markdown: item.details,
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
    (callApi as jest.Mock).mockReturnValue(getChallengeResult);
  });

  it('gets challenge by id', async () => {
    await store.dispatch<any>(getChallenge(challenge_id));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_CHALLENGE, {
      challenge_id,
      include:
        'accepted_community_challenges.person.first_name,accepted_community_challenges.person.last_name,accepted_community_challenges.person.organizational_permissions',
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
