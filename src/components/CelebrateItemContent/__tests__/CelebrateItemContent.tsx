import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { CELEBRATEABLE_TYPES, INTERACTION_TYPES } from '../../../constants';
import { CHALLENGE_DETAIL_SCREEN } from '../../../containers/ChallengeDetailScreen';
import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem } from '../../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';
import { Organization } from '../../../reducers/organizations';
import { CELEBRATE_ITEM_FRAGMENT } from '../../../components/CelebrateItem/queries';
import { CommunityCelebrationCelebrateableEnum } from '../../../../__generated__/globalTypes';

import CelebrateItemContent, { CelebrateItemContentProps } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const myId = '123';
const otherId = '456';
const organization: Organization = { id: '111', name: 'Celebration Community' };
const event = mockFragment<CelebrateItem>(CELEBRATE_ITEM_FRAGMENT);
const meEvent: CelebrateItem = {
  ...event,
  subjectPerson: {
    __typename: 'Person',
    id: myId,
    firstName: 'John',
    lastName: 'Smith',
  },
};
const otherEvent: CelebrateItem = {
  ...event,
  subjectPerson: {
    __typename: 'Person',
    id: otherId,
    firstName: 'John',
    lastName: 'Smith',
  },
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
    e: CelebrateItem,
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

  it('renders event with no subjectPerson, defaults to subjectPersonName', () =>
    testEvent({ ...event, subjectPerson: null }));

  it('renders event with no subjectPerson and no subjectPersonName', () => {
    testEvent(
      {
        ...event,
        subjectPerson: null,
        subjectPersonName: null,
      },
      organization,
    );
  });

  it('renders event for subject=me, liked=true, like count>0', () => {
    testEvent({
      ...meEvent,
      likesCount: 1,
      liked: true,
    });
  });

  it('renders event for subject=me, liked=false, like count>0', () => {
    testEvent({
      ...meEvent,
      likesCount: 1,
      liked: false,
    });
  });

  it('renders event for subject=me, liked=false, like count=0', () => {
    testEvent({
      ...meEvent,
      likesCount: 0,
      liked: false,
    });
  });

  it('renders event for subject=other, liked=true, like count>0', () => {
    testEvent({
      ...otherEvent,
      likesCount: 1,
      liked: true,
    });
  });

  it('renders event for subject=other, liked=false, like count=0', () => {
    testEvent({
      ...otherEvent,
      likesCount: 0,
      liked: false,
    });
  });

  describe('message', () => {
    const messageBaseEvent: CelebrateItem = {
      ...meEvent,
      likesCount: 0,
      liked: false,
    };

    it('renders event with no subject person name', () => {
      testEvent({
        ...messageBaseEvent,
        subjectPerson: null,
        subjectPersonName: null,
        celebrateableType: CommunityCelebrationCelebrateableEnum.completed_step,
        adjectiveAttributeValue: '3',
      });
    });

    describe('renders step of faith event with stage', () => {
      const testEventStage = (stageNum: string) =>
        testEvent({
          ...messageBaseEvent,
          celebrateableType:
            CommunityCelebrationCelebrateableEnum.completed_step,
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
        celebrateableType: CommunityCelebrationCelebrateableEnum.completed_step,
        adjectiveAttributeValue: null,
      });
    });

    describe('renders interaction event', () => {
      const testEventInteraction = (interaction: string) =>
        testEvent({
          ...messageBaseEvent,
          celebrateableType:
            CommunityCelebrationCelebrateableEnum.completed_interaction,
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
        celebrateableType:
          CommunityCelebrationCelebrateableEnum.community_challenge,
        changedAttributeName: CELEBRATEABLE_TYPES.challengeItemTypes.accepted,
        objectDescription: 'Invite a friend to church',
      });
    });

    it('renders completed challenge event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateableType:
          CommunityCelebrationCelebrateableEnum.community_challenge,
        changedAttributeName: CELEBRATEABLE_TYPES.challengeItemTypes.completed,
        objectDescription: 'Invite a friend to church',
      });
    });

    it('renders created community event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateableType:
          CommunityCelebrationCelebrateableEnum.created_community,
      });
    });

    it('renders joined community event', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateableType:
          CommunityCelebrationCelebrateableEnum.joined_community,
      });
    });

    it('renders story', () => {
      testEvent({
        ...messageBaseEvent,
        celebrateableType: CommunityCelebrationCelebrateableEnum.story,
        objectDescription: 'Once Upon a Time....',
      });
    });
  });
});

describe('onPressChallengeLink', () => {
  it('navigates to challenge detail screen', () => {
    const { getByTestId, store } = renderWithContext(
      <CelebrateItemContent
        event={{
          ...event,
          celebrateableType:
            CommunityCelebrationCelebrateableEnum.community_challenge,
        }}
        organization={organization}
      />,
      { initialState },
    );
    fireEvent.press(getByTestId('ChallengeLinkButton'));

    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      challengeId: event.adjectiveAttributeValue,
      orgId: organization.id,
    });
    expect(store.getActions()).toEqual([navigateResponse]);
  });
});
