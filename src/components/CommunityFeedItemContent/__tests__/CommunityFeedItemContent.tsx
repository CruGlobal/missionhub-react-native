/* eslint-disable max-lines */
import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import { IMocks } from 'graphql-tools';

import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { CHALLENGE_DETAIL_SCREEN } from '../../../containers/ChallengeDetailScreen';
import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { reloadGroupChallengeFeed } from '../../../actions/challenges';
import { CommunityFeedItemContent as FeedItem } from '../__generated__/CommunityFeedItemContent';
import { COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT } from '../queries';
import {
  PostTypeEnum,
  PostStepStatusEnum,
  FeedItemSubjectEventEnum,
} from '../../../../__generated__/globalTypes';
import { useFeatureFlags } from '../../../utils/hooks/useFeatureFlags';
import { CommunityFeedItemContent, CommunityFeedItemContentProps } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/challenges');
jest.mock('../../../utils/hooks/useFeatureFlags');
jest.mock('react-native-video', () => 'Video');

const initialState = {
  auth: { person: { id: '1' } },
};

const navigateResponse = { type: 'navigate push' };
const trackActionResult = { type: 'tracked plain action' };
const reloadGroupChallengeFeedReponse = { type: 'reload group feed' };

beforeEach(() => {
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (navigatePush as jest.Mock).mockReturnValue(navigateResponse);
  (reloadGroupChallengeFeed as jest.Mock).mockReturnValue(
    reloadGroupChallengeFeedReponse,
  );
  (useFeatureFlags as jest.Mock).mockReturnValue({ video: true });
});

function mockFrag(mocks: IMocks) {
  return mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
    mocks,
  });
}

describe('CommunityFeedItemContent', () => {
  const testEvent = (
    feedItem: FeedItem,
    otherProps: Partial<CommunityFeedItemContentProps> = {},
  ) => {
    renderWithContext(
      <CommunityFeedItemContent feedItem={feedItem} {...otherProps} />,
      { initialState },
    ).snapshot();
  };

  describe('Challenge Items', () => {
    it('renders for accepted challenge', () => {
      testEvent(
        mockFrag({
          FeedItem: () => ({
            subjectEvent: FeedItemSubjectEventEnum.challengeJoined,
            subject: () => ({
              __typename: 'AcceptedCommunityChallenge',
              completedAt: () => null,
            }),
          }),
        }),
      );
      expect.hasAssertions();
    });

    it('renders for completed challenge', () => {
      testEvent(
        mockFrag({
          FeedItem: () => ({
            subjectEvent: FeedItemSubjectEventEnum.challengeCompleted,
            subject: () => ({ __typename: 'AcceptedCommunityChallenge' }),
          }),
        }),
      );
      expect.hasAssertions();
    });

    it('renders with no subjectPerson, defaults to subjectPersonName', () => {
      testEvent(
        mockFrag({
          FeedItem: () => ({
            subjectEvent: FeedItemSubjectEventEnum.challengeJoined,
            subject: () => ({ __typename: 'AcceptedCommunityChallenge' }),
            subjectPerson: () => null,
          }),
        }),
      );
      expect.hasAssertions();
    });

    it('renders with no subjectPerson and no subjectPersonName', () => {
      testEvent(
        mockFrag({
          FeedItem: () => ({
            subjectEvent: FeedItemSubjectEventEnum.challengeJoined,
            subject: () => ({ __typename: 'AcceptedCommunityChallenge' }),
            subjectPerson: () => null,
            subjectPersonName: () => null,
          }),
        }),
      );
      expect.hasAssertions();
    });
  });

  describe('Step Item', () => {
    describe('renders step of faith event with stage', () => {
      const testEventStage = (stageNum: string) =>
        testEvent(
          mockFrag({
            FeedItem: () => ({
              subject: () => ({
                __typename: 'Step',
                receiverStageAtCompletion: () => ({ id: stageNum }),
              }),
            }),
          }),
        );

      it('1', () => {
        testEventStage('1');
        expect.hasAssertions();
      });
      it('2', () => {
        testEventStage('2');
        expect.hasAssertions();
      });
      it('3', () => {
        testEventStage('3');
        expect.hasAssertions();
      });
      it('4', () => {
        testEventStage('4');
        expect.hasAssertions();
      });
      it('5', () => {
        testEventStage('5');
        expect.hasAssertions();
      });
      it('Not Sure', () => {
        testEventStage('6');
        expect.hasAssertions();
      });
    });

    it('renders step of faith event without stage', () => {
      testEvent(
        mockFrag({
          FeedItem: () => ({
            subject: () => ({
              __typename: 'Step',
              receiverStageAtCompletion: () => null,
            }),
          }),
        }),
      );
      expect.hasAssertions();
    });

    it('renders with no subjectPerson, defaults to subjectPersonName', () => {
      testEvent(
        mockFrag({
          FeedItem: () => ({
            subject: () => ({ __typename: 'Step' }),
            subjectPerson: () => null,
          }),
        }),
      );
      expect.hasAssertions();
    });

    it('renders with no subjectPerson and no subjectPersonName', () => {
      testEvent(
        mockFrag({
          FeedItem: () => ({
            subject: () => ({ __typename: 'Step' }),
            subjectPerson: () => null,
            subjectPersonName: () => null,
          }),
        }),
      );
      expect.hasAssertions();
    });
  });

  describe('New Member Items', () => {
    it('renders new member item', () => {
      testEvent(
        mockFrag({
          FeedItem: () => ({
            subject: () => ({
              __typename: 'CommunityPermission',
            }),
          }),
        }),
      );
      expect.hasAssertions();
    });
  });

  describe('Post Items', () => {
    it('renders post', () => {
      testEvent(
        mockFrag({
          FeedItem: () => ({
            subject: () => ({
              __typename: 'Post',
              postType: PostTypeEnum.story,
              mediaContentType: null,
              mediaExpiringUrl: null,
            }),
          }),
        }),
      );
      expect.hasAssertions();
    });
    it('renders post with AddToMySteps', () => {
      testEvent(
        mockFrag({
          FeedItem: () => ({
            subject: () => ({
              __typename: 'Post',
              postType: PostTypeEnum.prayer_request,
              stepStatus: PostStepStatusEnum.NONE,
              mediaContentType: null,
              mediaExpiringUrl: null,
            }),
          }),
        }),
      );
      expect.hasAssertions();
    });
    it('renders post without AddToMyStepsButton', () => {
      testEvent(
        mockFrag({
          FeedItem: () => ({
            subject: () => ({
              __typename: 'Post',
              postType: PostTypeEnum.prayer_request,
              stepStatus: PostStepStatusEnum.INCOMPLETE,
              mediaContentType: null,
              mediaExpiringUrl: null,
            }),
          }),
        }),
      );
      expect.hasAssertions();
    });
    it('renders post without likeAndComment section', () => {
      testEvent(
        mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
          mocks: {
            FeedItem: () => ({
              subject: () => ({
                __typename: 'Post',
                postType: PostTypeEnum.prayer_request,
                stepStatus: PostStepStatusEnum.INCOMPLETE,
                mediaContentType: null,
                mediaExpiringUrl: null,
              }),
            }),
          },
        }),
        { showLikeAndComment: false },
      );
      expect.hasAssertions();
    });
  });
  it('renders community name and community photo when postType is announcement', () => {
    testEvent(
      mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
        mocks: {
          FeedItem: () => ({
            subject: () => ({
              __typename: 'Post',
              postType: PostTypeEnum.announcement,
              stepStatus: PostStepStatusEnum.INCOMPLETE,
              mediaContentType: null,
              mediaExpiringUrl: null,
            }),
          }),
        },
      }),
    );
    expect.hasAssertions();
  });
  it('renders default community avatar when communityPhotoUrl is null', () => {
    testEvent(
      mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
        mocks: {
          FeedItem: () => ({
            community: () => ({
              communityPhotoUrl: null,
            }),
            subject: () => ({
              __typename: 'Post',
              postType: PostTypeEnum.announcement,
              stepStatus: PostStepStatusEnum.INCOMPLETE,
              mediaContentType: null,
              mediaExpiringUrl: null,
            }),
          }),
        },
      }),
    );
    expect.hasAssertions();
  });
  it('renders with image', () => {
    testEvent(
      mockFrag({
        FeedItem: () => ({
          subject: () => ({
            __typename: 'Post',
            postType: PostTypeEnum.story,
            mediaContentType: 'image/jpg',
          }),
        }),
      }),
    );
    expect.hasAssertions();
  });
  it('renders with video', () => {
    testEvent(
      mockFrag({
        FeedItem: () => ({
          subject: () => ({
            __typename: 'Post',
            postType: PostTypeEnum.story,
            mediaContentType: 'video/mp4',
          }),
        }),
      }),
    );
    expect.hasAssertions();
  });
  it('renders without video if feature flag is false', () => {
    (useFeatureFlags as jest.Mock).mockReturnValue({ video: false });

    testEvent(
      mockFrag({
        FeedItem: () => ({
          subject: () => ({
            __typename: 'Post',
            postType: PostTypeEnum.story,
            mediaContentType: 'video/mp4',
          }),
        }),
      }),
    );
    expect.hasAssertions();
  });
  it('renders with menu options', () => {
    testEvent(
      mockFrag({
        FeedItem: () => ({ subject: () => ({ __typename: 'Step' }) }),
      }),
      { menuActions: [{ text: 'Hi!', onPress: () => {} }] },
    );
    expect.hasAssertions();
  });
  it('renders without menu options', () => {
    testEvent(
      mockFrag({
        FeedItem: () => ({ subject: () => ({ __typename: 'Step' }) }),
      }),
      { menuActions: [] },
    );
    expect.hasAssertions();
  });
});

describe('onPressChallengeLink', () => {
  it('navigates to challenge detail screen', async () => {
    const challengeFeedItem = mockFrag({
      FeedItem: () => ({
        subjectEvent: FeedItemSubjectEventEnum.challengeJoined,
        subject: () => ({ __typename: 'AcceptedCommunityChallenge' }),
      }),
    });

    const { getByTestId, store } = renderWithContext(
      <CommunityFeedItemContent feedItem={challengeFeedItem} />,
      { initialState },
    );
    // Used to fix unsupported subject type error
    if (challengeFeedItem.subject.__typename !== 'AcceptedCommunityChallenge') {
      throw new Error('Type was not AcceptedCommunityChallenge');
    }

    await fireEvent.press(getByTestId('ChallengeLinkButton'));

    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      challengeId: challengeFeedItem.subject.communityChallenge.id,
      orgId: challengeFeedItem.community?.id,
    });
    expect(reloadGroupChallengeFeed).toHaveBeenCalledWith(
      challengeFeedItem.community?.id,
    );
    expect(store.getActions()).toEqual([
      reloadGroupChallengeFeedReponse,
      navigateResponse,
    ]);
  });

  it('navigates to challenge detail screen | Global Community Challenge', async () => {
    const challengeFeedItem = mockFrag({
      FeedItem: () => ({
        subjectEvent: FeedItemSubjectEventEnum.challengeJoined,
        subject: () => ({ __typename: 'AcceptedCommunityChallenge' }),
        community: () => null,
      }),
    });

    const { getByTestId, store } = renderWithContext(
      <CommunityFeedItemContent feedItem={challengeFeedItem} />,
      { initialState },
    );
    // Used to fix unsupported subject type error
    if (challengeFeedItem.subject.__typename !== 'AcceptedCommunityChallenge') {
      throw new Error('Type was not AcceptedCommunityChallenge');
    }

    await fireEvent.press(getByTestId('ChallengeLinkButton'));

    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      challengeId: challengeFeedItem.subject.communityChallenge.id,
      orgId: GLOBAL_COMMUNITY_ID,
    });
    expect(reloadGroupChallengeFeed).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
    expect(store.getActions()).toEqual([
      reloadGroupChallengeFeedReponse,
      navigateResponse,
    ]);
  });
});

describe('press footer', () => {
  it('nothing should happen', () => {
    const challengeFeedItem = mockFrag({
      FeedItem: () => ({
        subjectEvent: FeedItemSubjectEventEnum.challengeJoined,
        subject: () => ({ __typename: 'AcceptedCommunityChallenge' }),
      }),
    });
    const { getByTestId } = renderWithContext(
      <CommunityFeedItemContent feedItem={challengeFeedItem} />,
      { initialState },
    );

    fireEvent.press(getByTestId('FooterTouchable'));
    expect(navigatePush).not.toHaveBeenCalled();
  });
});

describe('press video', () => {
  it('nothing should happen', () => {
    const videoPostItem = mockFrag({
      FeedItem: () => ({
        subject: () => ({ __typename: 'Post', mediaContentType: 'video/mp4' }),
      }),
    });
    const { getByTestId } = renderWithContext(
      <CommunityFeedItemContent feedItem={videoPostItem} />,
      { initialState },
    );

    fireEvent.press(getByTestId('VideoTouchable'));
    expect(navigatePush).not.toHaveBeenCalled();
  });
});

it('press comment press', () => {
  const storyFeedItem = mockFrag({
    FeedItem: () => ({
      subject: () => ({ __typename: 'Post', postType: PostTypeEnum.story }),
    }),
  });
  const onCommentPress = jest.fn();
  const { getByTestId } = renderWithContext(
    <CommunityFeedItemContent
      feedItem={storyFeedItem}
      onCommentPress={onCommentPress}
    />,
    { initialState },
  );

  fireEvent(getByTestId('CommentLikeComponent'), 'onCommentPress');
  expect(onCommentPress).toHaveBeenCalled();
});
