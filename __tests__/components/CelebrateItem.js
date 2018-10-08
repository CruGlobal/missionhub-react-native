import React from 'react';
import configureStore from 'redux-mock-store';

import {
  ACTIONS,
  CELEBRATEABLE_TYPES,
  INTERACTION_TYPES,
} from '../../src/constants';
import CelebrateItem from '../../src/components/CelebrateItem';
import { trackActionWithoutData } from '../../src/actions/analytics';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

jest.mock('../../src/actions/analytics');

const mockStore = configureStore();
let store;

const myId = '123';
const otherId = '456';
const trackActionResult = { type: 'tracked plain action' };

let event;

beforeEach(() => {
  store = mockStore();

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

  it('renders event for subject=me, liked=true, like count>0', () => {
    event = {
      subject_person_name: 'John Smith',
      subject_person: {
        id: myId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 1,
      liked: true,
    };
    testEvent(event);
  });

  it('renders event for subject=me, liked=false, like count>0', () => {
    event = {
      subject_person_name: 'John Smith',
      subject_person: {
        id: myId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 1,
      liked: false,
    };
    testEvent(event);
  });

  it('renders event for subject=me, liked=false, like count=0', () => {
    event = {
      subject_person_name: 'John Smith',
      subject_person: {
        id: myId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 0,
      liked: false,
    };
    testEvent(event);
  });

  it('renders event for subject=other, liked=true, like count>0', () => {
    event = {
      subject_person_name: 'John Smith',
      subject_person: {
        id: otherId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 1,
      liked: true,
    };
    testEvent(event);
  });

  it('renders event for subject=other, liked=false, like count=0', () => {
    event = {
      subject_person_name: 'John Smith',
      subject_person: {
        id: otherId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 0,
      liked: false,
    };
    testEvent(event);
  });

  describe('message', () => {
    const baseEvent = {
      subject_person_name: 'John Smith',
      subject_person: {
        id: myId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 0,
      liked: false,
    };

    it('renders step of faith event with stage', () => {
      event = {
        ...baseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
        adjective_attribute_value: '3',
      };
      testEvent(event);
    });

    it('renders step of faith event without stage', () => {
      event = {
        ...baseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
      };
      testEvent(event);
    });

    it('renders personal decision interaction event', () => {
      event = {
        ...baseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedInteraction,
        adjective_attribute_value:
          INTERACTION_TYPES.MHInteractionTypePersonalDecision.id,
      };
      testEvent(event);
    });

    it('renders something cool happened event', () => {
      event = {
        ...baseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedInteraction,
        adjective_attribute_value:
          INTERACTION_TYPES.MHInteractionTypeSomethingCoolHappened.id,
      };
      testEvent(event);
    });

    it('renders other interaction event', () => {
      event = {
        ...baseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedInteraction,
        adjective_attribute_value:
          INTERACTION_TYPES.MHInteractionTypeSpiritualConversation.id,
      };
      testEvent(event);
    });

    it('renders accepted challenge event', () => {
      event = {
        ...baseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.communityChallenge,
        changed_attribute_name: CELEBRATEABLE_TYPES.challengeItemTypes.accepted,
      };
      testEvent(event);
    });

    it('renders completed challenge event', () => {
      event = {
        ...baseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.communityChallenge,
        changed_attribute_name:
          CELEBRATEABLE_TYPES.challengeItemTypes.completed,
      };
      testEvent(event);
    });
  });
});

describe('onPressLikeIcon', () => {
  it('calls onToggleLike prop for unliked item', () => {
    event = {
      id: '1',
      subject_person_name: 'John Smith',
      subject_person: {
        id: otherId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 0,
      liked: false,
    };

    const instance = renderShallow(
      <CelebrateItem event={event} myId={myId} onToggleLike={jest.fn()} />,
      store,
    ).instance();

    instance.onPressLikeIcon();
    expect(instance.props.onToggleLike).toHaveBeenCalledWith(
      event.id,
      event.liked,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ITEM_LIKED);
    expect(store.getActions()).toEqual([trackActionResult]);
  });

  it('calls onToggleLike prop for liked item', () => {
    event = {
      id: '1',
      subject_person_name: 'John Smith',
      subject_person: {
        id: otherId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 0,
      liked: true,
    };

    const instance = renderShallow(
      <CelebrateItem event={event} myId={myId} onToggleLike={jest.fn()} />,
      store,
    ).instance();

    instance.onPressLikeIcon();
    expect(instance.props.onToggleLike).toHaveBeenCalledWith(
      event.id,
      event.liked,
    );
    expect(trackActionWithoutData).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
});
