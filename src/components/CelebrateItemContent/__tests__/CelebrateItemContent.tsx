import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { CELEBRATEABLE_TYPES, INTERACTION_TYPES } from '../../../constants';
import { CHALLENGE_DETAIL_SCREEN } from '../../../containers/ChallengeDetailScreen';
import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';

import CelebrateItemContent, { CelebrateItemContentProps } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

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
const orgId = '111';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Event = any;

const baseEvent = {
  subject_person_name: 'John Smith',
  changed_attribute_value: '2004-04-04 00:00:00 UTC',
};

const initialState = { auth: { person: { id: myId } } };

const navigateResponse = { type: 'navigate push' };
const trackActionResult = { type: 'tracked plain action' };

beforeEach(() => {
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (navigatePush as jest.Mock).mockReturnValue(navigateResponse);
});

describe('CelebrateItemContent', () => {
  const testEvent = (
    e: Event,
    otherProps: Partial<CelebrateItemContentProps> = {},
  ) => {
    renderWithContext(<CelebrateItemContent event={e} {...otherProps} />, {
      initialState,
    }).snapshot();
  };

  it('renders event with fixed height', () =>
    testEvent(baseEvent, { fixedHeight: true }));

  it('renders event with no subject person (global community event)', () =>
    testEvent(baseEvent));

  it('renders event with no subject person name', () => {
    testEvent({
      ...baseEvent,
      subject_person_name: null,
    });
  });

  it('renders event for subject=me, liked=true, like count>0', () => {
    testEvent({
      ...baseEvent,
      subject_person: mePerson,
      likes_count: 1,
      liked: true,
    });
  });

  it('renders event for subject=me, liked=false, like count>0', () => {
    testEvent({
      ...baseEvent,
      subject_person: mePerson,
      likes_count: 1,
      liked: false,
    });
  });

  it('renders event for subject=me, liked=false, like count=0', () => {
    testEvent({
      ...baseEvent,
      subject_person: mePerson,
      likes_count: 0,
      liked: false,
    });
  });

  it('renders event for subject=other, liked=true, like count>0', () => {
    testEvent({
      ...baseEvent,
      subject_person: otherPerson,
      likes_count: 1,
      liked: true,
    });
  });

  it('renders event for subject=other, liked=false, like count=0', () => {
    testEvent({
      ...baseEvent,
      subject_person: otherPerson,
      likes_count: 0,
      liked: false,
    });
  });

  describe('message', () => {
    const messageBaseEvent = {
      ...baseEvent,
      subject_person: mePerson,
      likes_count: 0,
      liked: false,
    };

    it('renders event with no subject person name', () => {
      testEvent({
        ...messageBaseEvent,
        subject_person: null,
        subject_person_name: null,
        celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
        adjective_attribute_value: '3',
      });
    });

    it('renders step of faith event with stage', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
        adjective_attribute_value: '3',
      });
    });

    it('renders step of faith event with Not Sure stage', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
        adjective_attribute_value: '6',
      });
    });

    it('renders step of faith event without stage', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
      });
    });

    it('renders personal decision interaction event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedInteraction,
        adjective_attribute_value:
          INTERACTION_TYPES.MHInteractionTypePersonalDecision.id,
      });
    });

    it('renders something cool happened event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedInteraction,
        adjective_attribute_value:
          INTERACTION_TYPES.MHInteractionTypeSomethingCoolHappened.id,
      });
    });

    it('renders other interaction event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.completedInteraction,
        adjective_attribute_value:
          INTERACTION_TYPES.MHInteractionTypeSpiritualConversation.id,
      });
    });

    it('renders accepted challenge event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
        changed_attribute_name: CELEBRATEABLE_TYPES.challengeItemTypes.accepted,
        object_description: 'Invite a friend to church',
      });
    });

    it('renders completed challenge event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
        changed_attribute_name:
          CELEBRATEABLE_TYPES.challengeItemTypes.completed,
        object_description: 'Invite a friend to church',
      });
    });

    it('renders created community event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.createdCommunity,
        organization: {
          name: 'Celebration Community',
        },
      });
    });

    it('renders joined community event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateable_type: CELEBRATEABLE_TYPES.joinedCommunity,
        organization: {
          name: 'Celebration Community',
        },
      });
    });

    it('renders joined community with passed in org name', () => {
      testEvent(
        {
          ...messageBaseEvent,
          celebrateable_type: CELEBRATEABLE_TYPES.joinedCommunity,
          organization: {
            name: 'Celebration Community',
          },
        },
        { organization: { id: orgId, name: 'My Real Org' } },
      );
    });
  });
});

describe('onPressChallengeLink', () => {
  it('navigates to challenge detail screen', () => {
    const challengeId = '123';

    const event = {
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

    const { getByTestId, store } = renderWithContext(
      <CelebrateItemContent event={event} />,
      { initialState },
    );
    fireEvent.press(getByTestId('ChallengeLinkButton'));

    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      challengeId,
      orgId,
    });
    expect(store.getActions()).toEqual([navigateResponse]);
  });
});
