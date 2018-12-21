import { Crashlytics } from 'react-native-fabric';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18next from 'i18next';

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
  showNotificationPrompt,
  landOnStashedCommunityScreen,
} from '../onboardingProfile';
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
} from '../../constants';
import * as common from '../../utils/common';
import callApi, { REQUESTS } from '../api';
import { navigatePush, navigateReset } from '../navigation';
import { NOTIFICATION_PRIMER_SCREEN } from '../../containers/NotificationPrimerScreen';
import {
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
} from '../../containers/Groups/GroupScreen';

jest.mock('../api');
jest.mock('../navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'push' })),
  navigateReset: jest.fn(() => ({ type: 'reset' })),
}));
jest.mock('../analytics', () => ({
  trackActionWithoutData: jest.fn(() => ({ type: 'track' })),
}));
jest.mock('../organizations');

let store = configureStore([thunk])();

const dispatch = jest.fn(response => Promise.resolve(response));

beforeEach(() => {
  common.isAndroid = false;
  jest.clearAllMocks();
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
    callApi.mockReturnValue({ person_id: '123456' });
    await createMyPerson('Roger', 'Goers')(dispatch);
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_MY_PERSON,
      {},
      {
        code: expect.any(String),
        first_name: 'Roger',
        last_name: 'Goers',
      },
    );
    expect(dispatch).toHaveBeenCalled();
    expect(Crashlytics.setUserIdentifier).toHaveBeenCalledWith('123456');
  });
});

describe('createPerson', () => {
  it('should send the correct API request', () => {
    createPerson('Roger', 'Goers', '1')(dispatch);
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_NEW_PERSON,
      {},
      {
        data: {
          type: 'person',
          attributes: {
            first_name: 'Roger',
            last_name: 'Goers',
          },
        },
        included: [
          {
            type: 'contact_assignment',
            attributes: {
              assigned_to_id: '1',
            },
          },
        ],
      },
    );
    expect(dispatch).toHaveBeenCalled();
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

const skipCompleteActions = [
  { type: 'track' },
  { type: COMPLETE_ONBOARDING },
  { type: 'push' },
];

describe('skip onboarding complete', () => {
  it('skipOnboardingComplete', () => {
    store.dispatch(skipOnboardingComplete());
    expect(store.getActions()).toEqual(skipCompleteActions);
  });
});

describe('skip onboarding', () => {
  it('skipOnboarding', () => {
    store.dispatch(skipOnboarding());
    expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_PRIMER_SCREEN, {
      onComplete: expect.any(Function),
    });
  });
  it('skipOnboarding android', () => {
    store = configureStore([thunk])();
    common.isAndroid = true;
    store.dispatch(skipOnboarding());
    expect(store.getActions()).toEqual(skipCompleteActions);
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

describe('show notification prompt', () => {
  it('showNotificationPrompt shows notification prompt for iOS', async () => {
    navigatePush.mockImplementation((_, { onComplete }) => onComplete());

    store = configureStore([thunk])();
    common.isAndroid = false;

    await store.dispatch(showNotificationPrompt());

    expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_PRIMER_SCREEN, {
      onComplete: expect.any(Function),
      descriptionText: i18next.t('notificationPrimer:onboardingDescription'),
    });
  });

  it('showNotificationPrompt does not show notification prompt for Android', async () => {
    navigatePush.mockImplementation((_, { onComplete }) => onComplete());

    store = configureStore([thunk])();
    common.isAndroid = true;

    await store.dispatch(showNotificationPrompt());

    expect(navigatePush).not.toHaveBeenCalled();
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
