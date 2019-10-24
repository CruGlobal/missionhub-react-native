import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  setOnboardingPersonId,
  setOnboardingCommunity,
  skipOnbardingAddPerson,
  createMyPerson,
  createPerson,
  skipOnboarding,
  skipOnboardingComplete,
  joinStashedCommunity,
  landOnStashedCommunityScreen,
  SKIP_ONBOARDING_ADD_PERSON,
} from '../onboarding';
import { showReminderOnLoad } from '../notifications';
import { joinCommunity } from '../organizations';
import { trackActionWithoutData } from '../analytics';
import {
  ACTIONS,
  NOTIFICATION_PROMPT_TYPES,
  LOAD_PERSON_DETAILS,
} from '../../constants';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { navigateReset } from '../navigation';
import {
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
} from '../../containers/Groups/GroupScreen';
import { rollbar } from '../../utils/rollbar.config';
import { getMe } from '../person';

jest.mock('../api');
jest.mock('../navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'push' })),
  navigateReset: jest.fn(() => ({ type: 'reset' })),
}));
jest.mock('../notifications');
jest.mock('../analytics', () => ({
  trackActionWithoutData: jest.fn(() => ({ type: 'track' })),
}));
jest.mock('../person');
jest.mock('../organizations');

const myId = '1';

let store = configureStore([thunk])({
  auth: { person: { id: myId } },
});

const showReminderResponse = { type: 'show notification prompt' };

beforeEach(() => {
  store.clearActions();
  (showReminderOnLoad as jest.Mock).mockReturnValue(showReminderResponse);
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

describe('skipOnbardingAddPerson', () => {
  it('should fire correct action', () => {
    expect(skipOnbardingAddPerson()).toMatchInlineSnapshot(`
      Object {
        "type": "SKIP_ONBOARDING_ADD_PERSON",
      }
    `);
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

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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

describe('skip onboarding complete', () => {
  it('skipOnboardingComplete', () => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    store.dispatch<any>(skipOnboardingComplete());
    expect(store.getActions()).toEqual([
      { type: 'track' },
      { type: SKIP_ONBOARDING_ADD_PERSON },
      { type: 'push' },
    ]);
  });
});

describe('skip onboarding', () => {
  it('skipOnboarding', async () => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    await store.dispatch<any>(skipOnboarding());
    expect(showReminderOnLoad).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.ONBOARDING,
      true,
    );
    expect(store.getActions()).toEqual([
      showReminderResponse,
      { type: 'track' },
      { type: SKIP_ONBOARDING_ADD_PERSON },
      { type: 'push' },
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

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    await store.dispatch<any>(landOnStashedCommunityScreen());

    expect(navigateReset).toHaveBeenCalledWith(GROUP_SCREEN, {
      organization: community,
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

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    await store.dispatch<any>(landOnStashedCommunityScreen());

    expect(navigateReset).toHaveBeenCalledWith(USER_CREATED_GROUP_SCREEN, {
      organization: community,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_JOINED_COMMUNITY,
    );
  });
});
