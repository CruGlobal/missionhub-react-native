/* eslint max-lines: 0 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  setOnboardingPersonId,
  setOnboardingCommunity,
  skipOnboardingAddPerson,
  createMyPerson,
  createPerson,
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
import {
  ACTIONS,
  NOTIFICATION_PROMPT_TYPES,
  LOAD_PERSON_DETAILS,
} from '../../constants';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { rollbar } from '../../utils/rollbar.config';
import { getMe } from '../person';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { COMMUNITY_TABS } from '../../containers/Communities/Community/CommunityTabs';

jest.mock('../api');
jest.mock('../notifications');
jest.mock('../analytics');
jest.mock('../person');
jest.mock('../organizations');
jest.mock('../navigation');

const myId = '1';

let store = configureStore([thunk])({
  auth: { person: { id: myId } },
});

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

describe('createMyPerson', () => {
  it('should send the correct API request', async () => {
    const first_name = 'Roger';
    const last_name = 'Goers';

    (callApi as jest.Mock).mockReturnValue({
      type: 'callApi',
    });
    (getMe as jest.Mock).mockReturnValue(() => ({
      id: myId,
      first_name,
      last_name,
      type: 'person',
    }));

    await store.dispatch<any>(createMyPerson('Roger', 'Goers'));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_MY_PERSON,
      {},
      {
        code: expect.any(String),
        first_name,
        last_name,
      },
    );
    expect(rollbar.setPerson).toHaveBeenCalledWith(myId);
    expect(store.getActions()).toEqual([
      { type: 'callApi' },
      {
        type: LOAD_PERSON_DETAILS,
        person: {
          type: 'person',
          id: myId,
          first_name,
          last_name,
        },
      },
    ]);
  });
});

describe('createPerson', () => {
  it('should send the correct API request', async () => {
    const myId = '1';
    const person_id = '123456';
    const first_name = 'Roger';
    const last_name = 'Goers';

    const person = { person_id, first_name, last_name };

    (callApi as jest.Mock).mockReturnValue(() => ({
      type: 'callApi',
      response: person,
    }));

    await store.dispatch<any>(createPerson(first_name, last_name));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_NEW_PERSON,
      {},
      {
        data: {
          type: 'person',
          attributes: {
            first_name,
            last_name,
          },
        },
        included: [
          {
            type: 'contact_assignment',
            attributes: {
              assigned_to_id: myId,
            },
          },
        ],
      },
    );
    expect(store.getActions()).toEqual([
      {
        type: LOAD_PERSON_DETAILS,
        person,
      },
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
  it('landOnStashedCommunityScreen navigates to GroupScreen', async () => {
    const community = {
      id: '1',
      community_code: '123456',
      community_url: 'abcdef',
      user_created: false,
    };

    store = configureStore([thunk])({
      onboarding: {
        community,
      },
      organizations: { all: [community] },
    });

    await store.dispatch<any>(landOnStashedCommunityScreen());

    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_TABS, {
      communityId: community.id,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_JOINED_COMMUNITY,
    );
  });

  it('landOnStashedCommunityScreen navigates to UserCreatedGroupScreen', async () => {
    const community = {
      id: '1',
      community_code: '123456',
      community_url: 'abcdef',
      user_created: true,
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
