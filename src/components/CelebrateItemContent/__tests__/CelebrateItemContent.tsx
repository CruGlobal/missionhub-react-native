import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { CELEBRATEABLE_TYPES, INTERACTION_TYPES } from '../../../constants';
import { CHALLENGE_DETAIL_SCREEN } from '../../../containers/ChallengeDetailScreen';
import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import {
  GetCelebrateFeed_community_celebrationItems_nodes,
  GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson,
} from '../../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';
import { Organization } from '../../../reducers/organizations';

import CelebrateItemContent, { CelebrateItemContentProps } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const myId = '123';
const mePerson: GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson = {
  __typename: 'Person',
  id: myId,
  firstName: 'John',
  lastName: 'Smith',
};
const otherId = '456';
const otherPerson: GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson = {
  __typename: 'Person',
  id: otherId,
  firstName: 'John',
  lastName: 'Smith',
};
const organization: Organization = { id: '111', name: 'Celebration Community' };

const baseEvent: GetCelebrateFeed_community_celebrationItems_nodes = {
  __typename: 'CommunityCelebrationItem',
  id: '4',
  adjectiveAttributeName: null,
  adjectiveAttributeValue: null,
  celebrateableId: '4',
  celebrateableType: CELEBRATEABLE_TYPES.story,
  changedAttributeName: 'created_at',
  changedAttributeValue: '2004-04-04 00:00:00 UTC',
  commentsCount: 0,
  liked: false,
  likesCount: 0,
  objectDescription: null,
  subjectPerson: null,
  subjectPersonName: 'John Smith',
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
    e: GetCelebrateFeed_community_celebrationItems_nodes,
    otherProps: Partial<CelebrateItemContentProps> = {},
  ) => {
    renderWithContext(
      <CelebrateItemContent
        event={e}
        organization={organization}
        {...otherProps}
      />,
      {
        initialState,
      },
    ).snapshot();
  };

  it('renders event with no subject person (global community event)', () =>
    testEvent(baseEvent));

  it('renders event with no subject person name', () => {
    testEvent(
      {
        ...baseEvent,
        subjectPersonName: null,
      },
      organization,
    );
  });

  it('renders event for subject=me, liked=true, like count>0', () => {
    testEvent({
      ...baseEvent,
      subjectPerson: mePerson,
      likesCount: 1,
      liked: true,
    });
  });

  it('renders event for subject=me, liked=false, like count>0', () => {
    testEvent({
      ...baseEvent,
      subjectPerson: mePerson,
      likesCount: 1,
      liked: false,
    });
  });

  it('renders event for subject=me, liked=false, like count=0', () => {
    testEvent({
      ...baseEvent,
      subjectPerson: mePerson,
      likesCount: 0,
      liked: false,
    });
  });

  it('renders event for subject=other, liked=true, like count>0', () => {
    testEvent({
      ...baseEvent,
      subjectPerson: otherPerson,
      likesCount: 1,
      liked: true,
    });
  });

  it('renders event for subject=other, liked=false, like count=0', () => {
    testEvent({
      ...baseEvent,
      subjectPerson: otherPerson,
      likesCount: 0,
      liked: false,
    });
  });

  describe('message', () => {
    const messageBaseEvent: GetCelebrateFeed_community_celebrationItems_nodes = {
      ...baseEvent,
      subjectPerson: mePerson,
      likesCount: 0,
      liked: false,
    };

    it('renders event with no subject person name', () => {
      testEvent({
        ...messageBaseEvent,
        subjectPerson: null,
        subjectPersonName: null,
        celebrateableType: CELEBRATEABLE_TYPES.completedStep,
        adjectiveAttributeValue: '3',
      });
    });

    describe('renders step of faith event with stage', () => {
      const testEventStage = (stageNum: string) =>
        testEvent({
          ...messageBaseEvent,
          celebrateableType: CELEBRATEABLE_TYPES.completedStep,
          adjectiveAttributeValue: stageNum,
        });

      it('1', () => testEventStage('1'));
      it('2', () => testEventStage('2'));
      it('3', () => testEventStage('3'));
      it('4', () => testEventStage('4'));
      it('5', () => testEventStage('5'));

      it('Not Sure', () => testEventStage('6'));
    });

    it('renders step of faith event without stage', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateableType: CELEBRATEABLE_TYPES.completedStep,
      });
    });

    describe('renders interaction event', () => {
      const testEventInteraction = (interaction: string) =>
        testEvent({
          ...messageBaseEvent,
          celebrateableType: CELEBRATEABLE_TYPES.completedInteraction,
          adjectiveAttributeValue: interaction,
        });

      it('personal decision', () =>
        testEventInteraction(
          INTERACTION_TYPES.MHInteractionTypePersonalDecision.id,
        ));
      it('something cool', () =>
        testEventInteraction(
          INTERACTION_TYPES.MHInteractionTypeSomethingCoolHappened.id,
        ));
      it('spiritual', () =>
        testEventInteraction(
          INTERACTION_TYPES.MHInteractionTypeSpiritualConversation.id,
        ));
      it('gospel', () =>
        testEventInteraction(
          INTERACTION_TYPES.MHInteractionTypeGospelPresentation.id,
        ));
      it('holy spirit', () =>
        testEventInteraction(
          INTERACTION_TYPES.MHInteractionTypeHolySpiritConversation.id,
        ));
      it('discipleship', () =>
        testEventInteraction(
          INTERACTION_TYPES.MHInteractionTypeDiscipleshipConversation.id,
        ));
      it('not found', () => testEventInteraction('not found'));
    });

    it('renders accepted challenge event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateableType: CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
        changedAttributeName: CELEBRATEABLE_TYPES.challengeItemTypes.accepted,
        objectDescription: 'Invite a friend to church',
      });
    });

    it('renders completed challenge event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateableType: CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
        changedAttributeName: CELEBRATEABLE_TYPES.challengeItemTypes.completed,
        objectDescription: 'Invite a friend to church',
      });
    });

    it('renders created community event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateableType: CELEBRATEABLE_TYPES.createdCommunity,
      });
    });

    it('renders joined community event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateableType: CELEBRATEABLE_TYPES.joinedCommunity,
      });
    });

    it('renders story', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateableType: CELEBRATEABLE_TYPES.story,
        objectDescription: 'Once Upon a Time....',
      });
    });
  });
});

describe('onPressChallengeLink', () => {
  it('navigates to challenge detail screen', () => {
    const challengeId = '123';

    const event: GetCelebrateFeed_community_celebrationItems_nodes = {
      ...baseEvent,
      id: '1',
      subjectPersonName: 'John Smith',
      subjectPerson: {
        __typename: 'Person',
        id: otherId,
        firstName: 'John',
        lastName: 'Smith',
      },
      changedAttributeValue: '2004-04-04 00:00:00 UTC',
      likesCount: 0,
      liked: true,
      celebrateableType: CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
      changedAttributeName: CELEBRATEABLE_TYPES.challengeItemTypes.completed,
      adjectiveAttributeValue: challengeId,
      objectDescription: 'Invite a friend to church',
    };

    const { getByTestId, store } = renderWithContext(
      <CelebrateItemContent event={event} organization={organization} />,
      { initialState },
    );
    fireEvent.press(getByTestId('ChallengeLinkButton'));

    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      challengeId,
      orgId: organization.id,
    });
    expect(store.getActions()).toEqual([navigateResponse]);
  });
});
