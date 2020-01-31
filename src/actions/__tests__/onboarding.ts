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
} from '../onboarding';
import { showReminderOnLoad } from '../notifications';
import { navigatePush, navigateBack, navigateToCommunity } from '../navigation';
import { joinCommunity } from '../organizations';
import {
  trackActionWithoutData,
  setAppContext,
  resetAppContext,
} from '../analytics';
import {
  ACTIONS,
  NOTIFICATION_PROMPT_TYPES,
  LOAD_PERSON_DETAILS,
  ANALYTICS_CONTEXT_ONBOARDING,
} from '../../constants';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { rollbar } from '../../utils/rollbar.config';
import { getMe } from '../person';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';

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
const navigateToCommunityResponse = { type: 'navigate to community' };
const showReminderResponse = { type: 'show notification prompt' };
const trackActionWithoutDataResult = { type: 'track action' };
const setAppContextResult = { type: 'set app context' };
const resetAppContextResult = { type: 'reset app context' };

beforeEach(() => {
  store.clearActions();
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResponse);
  (navigateToCommunity as jest.Mock).mockReturnValue(
    navigateToCommunityResponse,
  );
  (showReminderOnLoad as jest.Mock).mockReturnValue(showReminderResponse);
  (trackActionWithoutData as jest.Mock).mockReturnValue(
    trackActionWithoutDataResult,
  );
  (setAppContext as jest.Mock).mockReturnValue(setAppContextResult);
  (resetAppContext as jest.Mock).mockReturnValue(resetAppContextResult);
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

    expect(setAppContext).toHaveBeenCalledWith(ANALYTICS_CONTEXT_ONBOARDING);
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ONBOARDING_STARTED,
    );
    expect(store.getActions()).toEqual([
      setAppContextResult,
      trackActionWithoutDataResult,
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

    expect(showReminderOnLoad).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.ONBOARDING,
      true,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ONBOARDING_COMPLETE,
    );
    expect(resetAppContext).toHaveBeenCalledWith();
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN);
    expect(store.getActions()).toEqual([
      { type: SKIP_ONBOARDING_ADD_PERSON },
      showReminderResponse,
      trackActionWithoutDataResult,
      resetAppContextResult,
      navigatePushResponse,
    ]);
  });
});

describe('resetPersonAndCompleteOnboarding', () => {
  it('resets onboarding person and completed onboarding', async () => {
    await store.dispatch<any>(resetPersonAndCompleteOnboarding());

    expect(showReminderOnLoad).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.ONBOARDING,
      true,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ONBOARDING_COMPLETE,
    );
    expect(resetAppContext).toHaveBeenCalledWith();
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN);
    expect(store.getActions()).toEqual([
      { personId: '', type: SET_ONBOARDING_PERSON_ID },
      showReminderResponse,
      trackActionWithoutDataResult,
      resetAppContextResult,
      navigatePushResponse,
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
  beforeEach(() => {
    (navigateToCommunity as jest.Mock).mockReturnValue({
      type: 'navigate to org',
    });
  });

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

    expect(navigateToCommunity).toHaveBeenCalledWith(community);
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

    expect(navigateToCommunity).toHaveBeenCalledWith(community);
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_JOINED_COMMUNITY,
    );
  });
});
