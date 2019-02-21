/* eslint max-lines-per-function: 0 */

import React from 'react';
import configureStore from 'redux-mock-store';

import CelebrateItem from '..';

import { CELEBRATEABLE_TYPES, INTERACTION_TYPES } from '../../../constants';
import { CHALLENGE_DETAIL_SCREEN } from '../../../containers/ChallengeDetailScreen';
import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const mockStore = configureStore();
let store;

const myId = '123';
const mePerson = {
  id: myId,
  first_name: 'John',
  last_name: 'Smith',
};
const otherId = '456';
const otherPerson = {
  id: otherId,
  first_name: 'John',
  last_name: 'Smith',
};

const trackActionResult = { type: 'tracked plain action' };

let event;
const baseEvent = {
  subject_person_name: 'John Smith',
  changed_attribute_value: '2004-04-04 00:00:00 UTC',
};

beforeEach(() => {
  store = mockStore({ auth: { person: { id: myId } } });

  jest.clearAllMocks();
  trackActionWithoutData.mockReturnValue(trackActionResult);
});

describe('CelebrateItem', () => {
  const testEvent = e => {
    testSnapshotShallow(
      <CelebrateItem event={e} myId={myId} onToggleLike={jest.fn()} />,
      store,
    );
  };

  it('renders event with no subject person (global community event)', () =>
    testEvent({
      ...baseEvent,
    }));

  it('renders event with no subject person name', () => {
    testEvent({
      ...baseEvent,
      subject_person_name: null,
    });
  });

  it('renders event for subject=me, liked=true, like count>0', () => {
    event = {
      ...baseEvent,
      subject_person: mePerson,
      likes_count: 1,
      liked: true,
    };
    testEvent(event);
  });

  it('renders event for subject=me, liked=false, like count>0', () => {
    event = {
      ...baseEvent,
      subject_person: mePerson,
      likes_count: 1,
      liked: false,
    };
    testEvent(event);
  });

  it('renders event for subject=me, liked=false, like count=0', () => {
    event = {
      ...baseEvent,
      subject_person: mePerson,
      likes_count: 0,
      liked: false,
    };
    testEvent(event);
  });

  it('renders event for subject=other, liked=true, like count>0', () => {
    event = {
      ...baseEvent,
      subject_person: otherPerson,
      likes_count: 1,
      liked: true,
    };
    testEvent(event);
  });

  it('renders event for subject=other, liked=false, like count=0', () => {
    event = {
      ...baseEvent,
      subject_person: otherPerson,
      likes_count: 0,
      liked: false,
    };
    testEvent(event);
  });

  describe('message', () => {
    const messageBaseEvent = {
      ...baseEvent,
      subject_person: mePerson,
      likes_count: 0,
      liked: false,
    };

    it('renders event with no subject person name', () => {
      event = {
        ...messageBaseEvent,
        subject_person: null,
        subject_person_name: null,
        celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
        adjective_attribute_value: '3',
      };
      testEvent(event);
    });

    it('renders step of faith event with stage', () => {
      event = {
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
        adjective_attribute_value: '3',
      };
      testEvent(event);
    });

    it('renders step of faith event without stage', () => {
      event = {
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
      };
      testEvent(event);
    });

    it('renders personal decision interaction event', () => {
      event = {
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedInteraction,
        adjective_attribute_value:
          INTERACTION_TYPES.MHInteractionTypePersonalDecision.id,
      };
      testEvent(event);
    });

    it('renders something cool happened event', () => {
      event = {
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedInteraction,
        adjective_attribute_value:
          INTERACTION_TYPES.MHInteractionTypeSomethingCoolHappened.id,
      };
      testEvent(event);
    });

    it('renders other interaction event', () => {
      event = {
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedInteraction,
        adjective_attribute_value:
          INTERACTION_TYPES.MHInteractionTypeSpiritualConversation.id,
      };
      testEvent(event);
    });

    it('renders accepted challenge event', () => {
      event = {
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
        changed_attribute_name: CELEBRATEABLE_TYPES.challengeItemTypes.accepted,
        object_description: 'Invite a friend to church',
      };
      testEvent(event);
    });

    it('renders completed challenge event', () => {
      event = {
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
        changed_attribute_name:
          CELEBRATEABLE_TYPES.challengeItemTypes.completed,
        object_description: 'Invite a friend to church',
      };
      testEvent(event);
    });

    it('renders created community event', () => {
      event = {
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.createdCommunity,
        organization: {
          name: 'Celebration Community',
        },
      };
      testEvent(event);
    });

    it('renders joined community event', () => {
      event = {
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.joinedCommunity,
        organization: {
          name: 'Celebration Community',
        },
      };
      testEvent(event);
    });
  });
});

describe('onPressChallengeLink', () => {
  it('navigates to challenge detail screen', () => {
    const challengeId = '123';
    const orgId = '111';

    const navigateResponse = { type: 'navigate push' };
    navigatePush.mockReturnValue(navigateResponse);

    event = {
      id: '1',
      subject_person_name: 'John Smith',
      subject_person: {
        id: otherId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 0,
      liked: true,
      organization: { id: orgId },
      celebrateable_type: CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
      changed_attribute_name: CELEBRATEABLE_TYPES.challengeItemTypes.completed,
      adjective_attribute_value: challengeId,
      object_description: 'Invite a friend to church',
    };

    const instance = renderShallow(
      <CelebrateItem event={event} myId={myId} onToggleLike={jest.fn()} />,
      store,
    ).instance();

    instance.onPressChallengeLink();

    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      challengeId,
      orgId,
    });
    expect(store.getActions()).toEqual([navigateResponse]);
  });
});

describe('press card', () => {
  const onPressItem = jest.fn();

  it('calls onPressItem', () => {
    renderShallow(
      <CelebrateItem event={event} myId={myId} onPressItem={onPressItem} />,
      store,
    )
      .props()
      .onPress();

    expect(onPressItem).toHaveBeenCalledWith(event);
  });
});
