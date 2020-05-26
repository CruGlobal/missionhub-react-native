import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import { MockList } from 'graphql-tools';

import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { CHALLENGE_DETAIL_SCREEN } from '../../../containers/ChallengeDetailScreen';
import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { reloadGroupChallengeFeed } from '../../../actions/challenges';
import { CommunityFeedItemContent as FeedItem } from '../__generated__/CommunityFeedItemContent';
import { COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT } from '../queries';

import { CommunityFeedItemContent, CommunityFeedItemContentProps } from '..';
import { PostTypeEnum } from '../../../../__generated__/globalTypes';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/challenges');

// const feedItem = mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT);
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
});

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
    it('renders for accepted challenge', () =>
      testEvent(
        mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
          mocks: {
            FeedItem: () => ({
              subject: () => ({
                __typename: 'CommunityChallenge',
                acceptedCommunityChallengesList: () =>
                  new MockList(1, () => ({
                    completedAt: null,
                  })),
              }),
            }),
          },
        }),
      ));

    it('renders for completed challenge', () =>
      testEvent(
        mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
          mocks: {
            FeedItem: () => ({
              subject: () => ({
                __typename: 'CommunityChallenge',
                acceptedCommunityChallengesList: () => new MockList(1),
              }),
            }),
          },
        }),
      ));

    it('renders with no subjectPerson, defaults to subjectPersonName', () =>
      testEvent(
        mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
          mocks: {
            FeedItem: () => ({
              subject: () => ({
                __typename: 'CommunityChallenge',
                acceptedCommunityChallengesList: () => new MockList(1),
              }),
              subjectPerson: () => null,
            }),
          },
        }),
      ));

    it('renders with no subjectPerson and no subjectPersonName', () =>
      testEvent(
        mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
          mocks: {
            FeedItem: () => ({
              subject: () => ({
                __typename: 'CommunityChallenge',
                acceptedCommunityChallengesList: () => new MockList(1),
              }),
              subjectPerson: () => null,
              subjectPersonName: () => null,
            }),
          },
        }),
      ));
  });

  describe('Step Item', () => {
    describe('renders step of faith event with stage', () => {
      const testEventStage = (stageNum: string) =>
        testEvent(
          mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
            mocks: {
              FeedItem: () => ({
                subject: () => ({
                  __typename: 'Step',
                  receiverStageAtCompletion: () => ({ id: stageNum }),
                }),
              }),
            },
          }),
        );

      it('1', () => testEventStage('1'));
      it('2', () => testEventStage('2'));
      it('3', () => testEventStage('3'));
      it('4', () => testEventStage('4'));
      it('5', () => testEventStage('5'));
      it('Not Sure', () => testEventStage('6'));
    });

    it('renders step of faith event without stage', () =>
      testEvent(
        mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
          mocks: {
            FeedItem: () => ({
              subject: () => ({
                __typename: 'Step',
                receiverStageAtCompletion: () => null,
              }),
            }),
          },
        }),
      ));

    it('renders with no subjectPerson, defaults to subjectPersonName', () =>
      testEvent(
        mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
          mocks: {
            FeedItem: () => ({
              subject: () => ({
                __typename: 'Step',
              }),
              subjectPerson: () => null,
            }),
          },
        }),
      ));

    it('renders with no subjectPerson and no subjectPersonName', () =>
      testEvent(
        mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
          mocks: {
            FeedItem: () => ({
              subject: () => ({
                __typename: 'Step',
              }),
              subjectPerson: () => null,
              subjectPersonName: () => null,
            }),
          },
        }),
      ));
  });

  describe('Post Items', () => {
    it('renders post', () => {
      testEvent(
        mockFragment<FeedItem>(COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT, {
          mocks: {
            FeedItem: () => ({
              subject: () => ({
                __typename: 'Post',
                postType: PostTypeEnum.story,
              }),
            }),
          },
        }),
      );
    });
  });
});

describe('onPressChallengeLink', () => {
  it('navigates to challenge detail screen', async () => {
    const challengeFeedItem = mockFragment<FeedItem>(
      COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT,
      {
        mocks: {
          FeedItem: () => ({
            subject: () => ({
              __typename: 'CommunityChallenge',
            }),
          }),
        },
      },
    );

    const { getByTestId, store } = renderWithContext(
      <CommunityFeedItemContent feedItem={challengeFeedItem} />,
      { initialState },
    );

    await fireEvent.press(getByTestId('ChallengeLinkButton'));

    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      challengeId: challengeFeedItem.subject.id,
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
    const challengeFeedItem = mockFragment<FeedItem>(
      COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT,
      {
        mocks: {
          FeedItem: () => ({
            subject: () => ({
              __typename: 'CommunityChallenge',
            }),
            community: () => null,
          }),
        },
      },
    );

    const { getByTestId, store } = renderWithContext(
      <CommunityFeedItemContent feedItem={challengeFeedItem} />,
      { initialState },
    );
    await fireEvent.press(getByTestId('ChallengeLinkButton'));

    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      challengeId: challengeFeedItem.subject.id,
      orgId: GLOBAL_COMMUNITY_ID,
    });
    expect(reloadGroupChallengeFeed).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
    expect(store.getActions()).toEqual([
      reloadGroupChallengeFeedReponse,
      navigateResponse,
    ]);
  });
});
