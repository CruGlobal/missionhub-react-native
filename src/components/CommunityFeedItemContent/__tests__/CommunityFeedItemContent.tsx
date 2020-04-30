import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { CHALLENGE_DETAIL_SCREEN } from '../../../containers/ChallengeDetailScreen';
import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { COMMUNITY_FEED_ITEM_FRAGMENT } from '../../CommunityFeedItem/queries';
import { COMMUNITY_FRAGMENT } from '../../../containers/Groups/queries';
import { CommunityFragment } from '../../../containers/Groups/__generated__/CommunityFragment';
import {
  CommunityFeedItem,
  CommunityFeedItem_subjectPerson,
} from '../../CommunityFeedItem/__generated__/CommunityFeedItem';
import { PostTypeEnum } from '../../../../__generated__/globalTypes';
import { reloadGroupChallengeFeed } from '../../../actions/challenges';

import { CommunityFeedItemContent, CommunityFeedItemContentProps } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/challenges');

const myId = '123';
const organization = mockFragment<CommunityFragment>(COMMUNITY_FRAGMENT);
const item = mockFragment<CommunityFeedItem>(COMMUNITY_FEED_ITEM_FRAGMENT);
const meItem: CommunityFeedItem = {
  ...item,
  subjectPerson: {
    ...(item.subjectPerson as CommunityFeedItem_subjectPerson),
    id: myId,
  },
};

const initialState = { auth: { person: { id: myId } } };

const navigateResponse = { type: 'navigate push' };
const trackActionResult = { type: 'tracked plain action' };
const reloadGroupChallengeFeedReponse = { type: 'reload group feed' };

beforeEach(() => {
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (navigatePush as jest.Mock).mockReturnValue(navigateResponse);
  (reloadGroupChallengeFeed as jest.Mock).mockReturnValue(
    reloadGroupChallengeFeedReponse,
  );
});

describe('CelebrateItemContent', () => {
  const testEvent = (
    item: CommunityFeedItem,
    otherProps: Partial<CommunityFeedItemContentProps> = {},
  ) => {
    renderWithContext(
      <CommunityFeedItemContent
        item={item}
        organization={organization}
        {...otherProps}
      />,
      {
        initialState,
      },
    ).snapshot();
  };

  it('renders event with no subjectPerson, defaults to subjectPersonName', () =>
    testEvent({ ...item, subjectPerson: null }));

  it('renders event with no subjectPerson and no subjectPersonName', () => {
    testEvent(
      {
        ...item,
        subjectPerson: null,
        subjectPersonName: null,
      },
      {
        organization,
      },
    );
  });

  it('renders event for subject=me, liked=true, like count>0', () => {
    testEvent({
      ...meItem,
      likesCount: 1,
      liked: true,
    });
  });

  it('renders event for subject=me, liked=false, like count>0', () => {
    testEvent({
      ...meItem,
      likesCount: 1,
      liked: false,
    });
  });

  it('renders event for subject=me, liked=false, like count=0', () => {
    testEvent({
      ...meItem,
      likesCount: 0,
      liked: false,
    });
  });

  it('renders event for subject=other, liked=true, like count>0', () => {
    testEvent({
      ...item,
      likesCount: 1,
      liked: true,
    });
  });

  it('renders event for subject=other, liked=false, like count=0', () => {
    testEvent({
      ...item,
      likesCount: 0,
      liked: false,
    });
  });

  describe('message', () => {
    const messageBaseItem: CommunityFeedItem = {
      ...meItem,
      likesCount: 0,
      liked: false,
    };

    it('renders event with no subject person name', () => {
      testEvent({
        ...messageBaseItem,
        subjectPerson: null,
        subjectPersonName: null,
        subject: {
          __typename: 'Post',
          id: '12',
          content: 'Post!',
          mediaContentType: null,
          mediaExpiringUrl: null,
          postType: PostTypeEnum.story,
        },
      });
    });

    describe('renders step of faith event with stage', () => {
      const testEventStage = (stageNum: string) =>
        testEvent({
          ...messageBaseItem,
          subject: {
            __typename: 'Step',
            id: '12',
            title: 'Step of Faith',
            receiverStageAtCompletion: {
              __typename: 'Stage',
              id: stageNum,
            },
          },
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
        ...messageBaseItem,
        subject: {
          __typename: 'Step',
          id: '12',
          title: 'Step of Faith',
          receiverStageAtCompletion: null,
        },
      });
    });

    it('renders accepted challenge event', () => {
      testEvent({
        ...messageBaseItem,
        subject: {
          __typename: 'CommunityChallenge',
          id: '12',
          title: 'Invite a friend to church',
          acceptedCommunityChallengesList: [
            {
              __typename: 'AcceptedCommunityChallenge',
              id: '1',
              acceptedAt: 'asdfasd',
              completedAt: null,
            },
          ],
        },
      });
    });

    it('renders completed challenge event', () => {
      testEvent({
        ...messageBaseItem,
        subject: {
          __typename: 'CommunityChallenge',
          id: '12',
          title: 'Invite a friend to church',
          acceptedCommunityChallengesList: [
            {
              __typename: 'AcceptedCommunityChallenge',
              id: '1',
              acceptedAt: 'asdfasd',
              completedAt: 'asdfas',
            },
          ],
        },
      });
    });
  });
});

describe('onPressChallengeLink', () => {
  const challengeItem: CommunityFeedItem = {
    ...item,
    subject: {
      __typename: 'CommunityChallenge',
      id: item.subject.id,
      title: 'Invite a friend to church',
      acceptedCommunityChallengesList: [
        {
          __typename: 'AcceptedCommunityChallenge',
          id: '1',
          acceptedAt: 'asdfasd',
          completedAt: 'asdfas',
        },
      ],
    },
  };

  it('navigates to challenge detail screen', async () => {
    const { getByTestId, store } = renderWithContext(
      <CommunityFeedItemContent
        item={challengeItem}
        organization={organization}
      />,
      { initialState },
    );
    await fireEvent.press(getByTestId('ChallengeLinkButton'));

    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      challengeId: challengeItem.subject.id,
      orgId: organization.id,
    });
    expect(reloadGroupChallengeFeed).toHaveBeenCalledWith(organization.id);
    expect(store.getActions()).toEqual([
      reloadGroupChallengeFeedReponse,
      navigateResponse,
    ]);
  });

  it('navigates to challenge detail screen | Global Community Challenge', async () => {
    const { getByTestId, store } = renderWithContext(
      <CommunityFeedItemContent
        item={challengeItem}
        organization={{
          ...organization,
          name: 'MissionHub Community',
          id: GLOBAL_COMMUNITY_ID,
        }}
      />,
      { initialState },
    );
    await fireEvent.press(getByTestId('ChallengeLinkButton'));

    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      challengeId: item.subject.id,
      orgId: GLOBAL_COMMUNITY_ID,
    });
    expect(reloadGroupChallengeFeed).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
    expect(store.getActions()).toEqual([
      reloadGroupChallengeFeedReponse,
      navigateResponse,
    ]);
  });
});
