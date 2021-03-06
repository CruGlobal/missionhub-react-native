/* eslint-disable @typescript-eslint/no-explicit-any */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  setOnboardingPersonId,
  setOnboardingCommunity,
  skipOnboardingAddPerson,
  skipAddPersonAndCompleteOnboarding,
  resetPersonAndCompleteOnboarding,
  joinStashedCommunity,
  landOnStashedCommunityScreen,
  SKIP_ONBOARDING_ADD_PERSON,
  startOnboarding,
  SET_ONBOARDING_PERSON_ID,
  START_ONBOARDING,
} from '../onboarding';
import { checkNotifications } from '../notifications';
import { navigatePush, navigateBack } from '../navigation';
import { joinCommunity } from '../organizations';
import { trackActionWithoutData } from '../analytics';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../constants';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { COMMUNITY_TABS } from '../../containers/Communities/Community/constants';
import { createThunkStore } from '../../../testUtils';

jest.mock('../api');
jest.mock('../notifications');
jest.mock('../analytics');
jest.mock('../person');
jest.mock('../organizations');
jest.mock('../navigation');
jest.mock('../auth/userData');
jest.mock('../../auth/authUtilities', () => ({
  getAuthPerson: () => ({ id: '1' }),
}));

let store = createThunkStore();

const navigatePushResponse = { type: 'navigate push' };
const navigateBackResponse = { type: 'navigate back' };
const checkNotificationsResponse = { type: 'check notifications' };
const trackActionWithoutDataResult = { type: 'track action' };

beforeEach(() => {
  store.clearActions();
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResponse);
  (checkNotifications as jest.Mock).mockImplementation(
    (_, callback: () => void) => {
      callback();
      return checkNotificationsResponse;
    },
  );
  (trackActionWithoutData as jest.Mock).mockReturnValue(
    trackActionWithoutDataResult,
  );
});

describe('setOnboardingPersonId', () => {
  it('should fire correct action', () => {
    expect(setOnboardingPersonId('2')).toMatchInlineSnapshot(`
      Object {
        "personId": "2",
        "type": "SET_ONBOARDING_PERSON_ID",
      }
    `);
  });
});

describe('setOnboardingCommunity', () => {
  it('should fire correct action', () => {
    expect(
      setOnboardingCommunity({
        id: '10',
        community_code: 'abcd12',
        community_url: 'uis3udsusduusd',
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "community": Object {
          "community_code": "abcd12",
          "community_url": "uis3udsusduusd",
          "id": "10",
        },
        "type": "SET_ONBOARDING_COMMUNITY_ID",
      }
    `);
  });
});

describe('skipOnboardingAddPerson', () => {
  it('should fire correct action', () => {
    expect(skipOnboardingAddPerson()).toMatchInlineSnapshot(`
      Object {
        "type": "SKIP_ONBOARDING_ADD_PERSON",
      }
    `);
  });
});

describe('startOnboarding', () => {
  it('sends start onboarding action', () => {
    store.dispatch<any>(startOnboarding());

    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ONBOARDING_STARTED,
    );
    expect(store.getActions()).toEqual([
      trackActionWithoutDataResult,
      { type: START_ONBOARDING },
    ]);
  });
});

describe('skipAddPersonAndCompleteOnboarding', () => {
  it('skips add person and completes onboarding', async () => {
    await store.dispatch<any>(skipAddPersonAndCompleteOnboarding());

    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.ONBOARDING,
      expect.any(Function),
    );
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN);
    expect(store.getActions()).toEqual([
      { type: SKIP_ONBOARDING_ADD_PERSON },
      navigatePushResponse,
      checkNotificationsResponse,
    ]);
  });
});

describe('resetPersonAndCompleteOnboarding', () => {
  it('resets onboarding person and completed onboarding', async () => {
    await store.dispatch<any>(resetPersonAndCompleteOnboarding());

    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.ONBOARDING,
      expect.any(Function),
    );
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN);
    expect(store.getActions()).toEqual([
      { personId: '', type: SET_ONBOARDING_PERSON_ID },
      navigatePushResponse,
      checkNotificationsResponse,
    ]);
  });
});

describe('join stashed community', () => {
  it('joinStashedCommunuity', async () => {
    (joinCommunity as jest.Mock).mockReturnValue(() => Promise.resolve());

    const community = {
      id: '1',
      community_code: '123456',
      community_url: 'abcdef',
    };

    store = configureStore([thunk])({
      onboarding: { community },
    });

    await store.dispatch<any>(joinStashedCommunity());

    expect(joinCommunity).toHaveBeenCalledWith(
      community.id,
      community.community_code,
      community.community_url,
    );
  });
});

describe('land on stashed community screen', () => {
  it('landOnStashedCommunityScreen navigates to Community Tabs', async () => {
    const community = {
      id: '1',
      community_code: '123456',
      community_url: 'abcdef',
    };

    store = configureStore([thunk])({
      onboarding: {
        community,
      },
      organizations: {
        all: [community],
      },
    });

    await store.dispatch<any>(landOnStashedCommunityScreen());

    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_TABS, {
      communityId: community.id,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_JOINED_COMMUNITY,
    );
  });
});
