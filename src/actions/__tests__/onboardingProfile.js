import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  firstNameChanged,
  lastNameChanged,
  createMyPerson,
  personFirstNameChanged,
  personLastNameChanged,
  createPerson,
  resetPerson,
  completeOnboarding,
  stashCommunityToJoin,
  skipOnboarding,
  skipOnboardingComplete,
  joinStashedCommunity,
  landOnStashedCommunityScreen,
} from '../onboardingProfile';
import { showReminderOnLoad } from '../notifications';
import { joinCommunity } from '../organizations';
import { trackActionWithoutData } from '../analytics';
import {
  COMPLETE_ONBOARDING,
  FIRST_NAME_CHANGED,
  LAST_NAME_CHANGED,
  PERSON_FIRST_NAME_CHANGED,
  PERSON_LAST_NAME_CHANGED,
  RESET_ONBOARDING_PERSON,
  STASH_COMMUNITY_TO_JOIN,
  ACTIONS,
  NOTIFICATION_PROMPT_TYPES,
  LOAD_PERSON_DETAILS,
} from '../../constants';
import * as common from '../../utils/common';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { navigateReset } from '../navigation';
import {
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
} from '../../containers/Groups/GroupScreen';
import { rollbar } from '../../utils/rollbar.config';

jest.mock('../api');
jest.mock('../navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'push' })),
  navigateReset: jest.fn(() => ({ type: 'reset' })),
}));
jest.mock('../notifications');
jest.mock('../analytics', () => ({
  trackActionWithoutData: jest.fn(() => ({ type: 'track' })),
}));
jest.mock('../organizations');

let store = configureStore([thunk])();

const dispatch = jest.fn(response => Promise.resolve(response));

const showReminderResponse = { type: 'show notification prompt' };

beforeEach(() => {
  store.clearActions();
  common.isAndroid = false;
  showReminderOnLoad.mockReturnValue(showReminderResponse);
});

describe('completeOnboarding', () => {
  it('should return completeOnboarding', () => {
    expect(completeOnboarding()).toEqual({ type: COMPLETE_ONBOARDING });
  });
});

describe('firstNameChanged', () => {
  it('should return the correct action', () => {
    expect(firstNameChanged('test')).toEqual({
      type: FIRST_NAME_CHANGED,
      firstName: 'test',
    });
  });
});

describe('lastNameChanged', () => {
  it('should return the correct action', () => {
    expect(lastNameChanged('test')).toEqual({
      type: LAST_NAME_CHANGED,
      lastName: 'test',
    });
  });
});

describe('createMyPerson', () => {
  it('should send the correct API request', async () => {
    const person_id = '123456';
    const first_name = 'Roger';
    const last_name = 'Goers';

    callApi.mockReturnValue({ person_id, first_name, last_name });

    await createMyPerson('Roger', 'Goers')(dispatch);

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_MY_PERSON,
      {},
      {
        code: expect.any(String),
        first_name,
        last_name,
      },
    );
    expect(rollbar.setPerson).toHaveBeenCalledWith(person_id);
    expect(dispatch).toHaveBeenCalledWith({
      type: LOAD_PERSON_DETAILS,
      person: {
        type: 'person',
        id: person_id,
        first_name,
        last_name,
      },
    });
  });
});

describe('createPerson', () => {
  it('should send the correct API request', async () => {
    const myId = '1';
    const person_id = '123456';
    const first_name = 'Roger';
    const last_name = 'Goers';

    const person = { person_id, first_name, last_name };

    callApi.mockReturnValue({ type: 'callApi', response: person });

    await createPerson(first_name, last_name, myId)(dispatch);

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
    expect(dispatch).toHaveBeenCalledWith({
      type: LOAD_PERSON_DETAILS,
      person,
    });
  });
});

describe('personFirstNameChanged', () => {
  it('should return the correct action', () => {
    expect(personFirstNameChanged('test')).toEqual({
      type: PERSON_FIRST_NAME_CHANGED,
      personFirstName: 'test',
    });
  });
});

describe('personLastNameChanged', () => {
  it('should return the correct action', () => {
    expect(personLastNameChanged('test')).toEqual({
      type: PERSON_LAST_NAME_CHANGED,
      personLastName: 'test',
    });
  });
});

describe('resetPerson', () => {
  it('should return the correct action', () => {
    expect(resetPerson()).toEqual({
      type: RESET_ONBOARDING_PERSON,
    });
  });
});

describe('stashCommunityToJoin', () => {
  it('should return the correct action', () => {
    expect(stashCommunityToJoin({ community: { id: '1' } })).toEqual({
      type: STASH_COMMUNITY_TO_JOIN,
      community: { id: '1' },
    });
  });
});

describe('skip onboarding complete', () => {
  it('skipOnboardingComplete', () => {
    store.dispatch(skipOnboardingComplete());
    expect(store.getActions()).toEqual([
      { type: 'track' },
      { type: COMPLETE_ONBOARDING },
      { type: 'push' },
    ]);
  });
});

describe('skip onboarding', () => {
  it('skipOnboarding', async () => {
    await store.dispatch(skipOnboarding());
    expect(showReminderOnLoad).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.ONBOARDING,
      true,
    );
    expect(store.getActions()).toEqual([
      showReminderResponse,
      { type: 'track' },
      { type: COMPLETE_ONBOARDING },
      { type: 'push' },
    ]);
  });
});

describe('join stashed community', () => {
  it('joinStashedCommunuity', async () => {
    joinCommunity.mockReturnValue(() => Promise.resolve());

    const community = {
      id: '1',
      community_code: '123456',
      community_url: 'abcdef',
    };

    store = configureStore([thunk])({
      profile: {
        community,
      },
    });

    await store.dispatch(joinStashedCommunity());

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
      profile: {
        community,
      },
    });

    await store.dispatch(landOnStashedCommunityScreen());

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
      profile: {
        community,
      },
    });

    await store.dispatch(landOnStashedCommunityScreen());

    expect(navigateReset).toHaveBeenCalledWith(USER_CREATED_GROUP_SCREEN, {
      organization: community,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_JOINED_COMMUNITY,
    );
  });
});
