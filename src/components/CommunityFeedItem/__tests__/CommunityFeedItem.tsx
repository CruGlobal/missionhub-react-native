/* eslint-disable max-lines */

import React from 'react';
import { Alert, ActionSheetIOS } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import MockDate from 'mockdate';
import i18next from 'i18next';
import { useMutation } from '@apollo/react-hooks';

import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { FEED_ITEM_DETAIL_SCREEN } from '../../../containers/Communities/Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';
import { CREATE_POST_SCREEN } from '../../../containers/Groups/CreatePostScreen';
import { ADD_POST_TO_STEPS_SCREEN } from '../../../containers/AddPostToStepsScreen/index';
import { COMMUNITY_FEED_WITH_TYPE_SCREEN } from '../../../containers/CommunityFeedWithType';
import {
  COMMUNITY_FEED_ITEM_FRAGMENT,
  DELETE_POST,
  REPORT_POST,
} from '../queries';
import {
  CommunityFeedItem as CommunityFeedItemFragment,
  CommunityFeedItem_subject_Post,
} from '../__generated__/CommunityFeedItem';
import {
  PostTypeEnum,
  FeedItemSubjectTypeEnum,
  PostStepStatusEnum,
  FeedItemSubjectEventEnum,
} from '../../../../__generated__/globalTypes';
import { CommunityFeedItem } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../Avatar', () => 'Avatar');
jest.mock('../../Card', () => 'Card');

const communityId = '3';
const communityName = 'Community Name';
const myId = '1';

const prayerPostItem = mockFragment<CommunityFeedItemFragment>(
  COMMUNITY_FEED_ITEM_FRAGMENT,
  {
    mocks: {
      FeedItem: () => ({
        community: () => ({ id: communityId }),
        subject: () => ({
          __typename: 'Post',
          postType: PostTypeEnum.prayer_request,
        }),
      }),
    },
  },
);
const myPrayerPostItem = mockFragment<CommunityFeedItemFragment>(
  COMMUNITY_FEED_ITEM_FRAGMENT,
  {
    mocks: {
      FeedItem: () => ({
        community: () => ({ id: communityId }),
        subject: () => ({
          __typename: 'Post',
          postType: PostTypeEnum.prayer_request,
          stepStatus: PostStepStatusEnum.NOT_SUPPORTED,
        }),
        subjectPerson: () => ({ id: myId }),
      }),
    },
  },
);
const storyPostItem = mockFragment<CommunityFeedItemFragment>(
  COMMUNITY_FEED_ITEM_FRAGMENT,
  {
    mocks: {
      FeedItem: () => ({
        community: () => ({ id: communityId, name: communityName }),
        subject: () => ({
          __typename: 'Post',
          postType: PostTypeEnum.story,
        }),
      }),
    },
  },
);
const stepItem = mockFragment<CommunityFeedItemFragment>(
  COMMUNITY_FEED_ITEM_FRAGMENT,
  {
    mocks: {
      FeedItem: () => ({
        community: () => ({ id: communityId }),
        subject: () => ({
          __typename: 'Step',
        }),
      }),
    },
  },
);
const challengeItem = mockFragment<CommunityFeedItemFragment>(
  COMMUNITY_FEED_ITEM_FRAGMENT,
  {
    mocks: {
      FeedItem: () => ({
        community: () => ({ id: communityId }),
        subjectEvent: FeedItemSubjectEventEnum.challengeJoined,
        subject: () => ({ __typename: 'AcceptedCommunityChallenge' }),
      }),
    },
  },
);
const newMemberItem = mockFragment<CommunityFeedItemFragment>(
  COMMUNITY_FEED_ITEM_FRAGMENT,
  {
    mocks: {
      FeedItem: () => ({
        community: () => ({ id: communityId }),
        subject: () => ({
          __typename: 'CommunityPermission',
        }),
      }),
    },
  },
);

MockDate.set('2019-08-21 12:00:00', 300);

const onClearNotification = jest.fn();
const onEditPost = jest.fn();

const trackActionResult = { type: 'tracked plain action' };
const navigatePushResult = { type: 'navigate push' };

const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
});

describe('global community', () => {
  it('renders correctly', () => {
    renderWithContext(
      <CommunityFeedItem
        feedItem={{ ...stepItem, community: null }}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders with clear notification button correctly', () => {
    renderWithContext(
      <CommunityFeedItem
        feedItem={{ ...stepItem, community: null }}
        namePressable={false}
        onClearNotification={onClearNotification}
        onEditPost={onEditPost}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders post item correctly', () => {
    renderWithContext(
      <CommunityFeedItem
        feedItem={{ ...storyPostItem, community: null }}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      {
        initialState,
      },
    ).snapshot();
  });
});

describe('Community', () => {
  it('renders post correctly without add to steps button ', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        feedItem={storyPostItem}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders post created by me correctly without add to steps button', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        feedItem={myPrayerPostItem}
        namePressable={true}
        onEditPost={onEditPost}
      />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders post correctly with add to steps button', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        feedItem={mockFragment<CommunityFeedItemFragment>(
          COMMUNITY_FEED_ITEM_FRAGMENT,
          {
            mocks: {
              FeedItem: () => ({
                community: () => ({ id: communityId }),
                subject: () => ({
                  __typename: 'Post',
                  postType: PostTypeEnum.prayer_request,
                  stepStatus: PostStepStatusEnum.NONE,
                }),
              }),
            },
          },
        )}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders post correctly without image', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        feedItem={{
          ...storyPostItem,
          subject: {
            ...(storyPostItem.subject as CommunityFeedItem_subject_Post),
            mediaExpiringUrl: null,
          },
        }}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      { initialState },
    );
    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders step correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        feedItem={stepItem}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders challenge correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        feedItem={challengeItem}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders new member item correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        feedItem={newMemberItem}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders with clear notification button correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        feedItem={storyPostItem}
        onClearNotification={onClearNotification}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
  });
});

it('renders with name pressable correctly', async () => {
  const { snapshot } = renderWithContext(
    <CommunityFeedItem
      feedItem={storyPostItem}
      namePressable={true}
      onEditPost={onEditPost}
    />,
    {
      initialState,
    },
  );
  await flushMicrotasksQueue();
  snapshot();
});

describe('press card', () => {
  it('not pressable in global community', () => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedItem
        feedItem={{ ...stepItem, community: null }}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      { initialState },
    );

    expect(getByTestId('CommunityFeedItem').props.onPress).toEqual(undefined);
  });

  it('navigates to celebrate detail screen', () => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedItem
        feedItem={stepItem}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      { initialState },
    );

    fireEvent.press(getByTestId('CommunityFeedItem'));

    expect(navigatePush).toHaveBeenCalledWith(FEED_ITEM_DETAIL_SCREEN, {
      feedItemId: stepItem.id,
    });
  });
});

describe('long-press card', () => {
  describe('post written by me', () => {
    const myPost: CommunityFeedItemFragment = {
      ...storyPostItem,
      subjectPerson: storyPostItem.subjectPerson
        ? { ...storyPostItem.subjectPerson, id: myId }
        : null,
    };

    it('navigates to edit post screen', () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CommunityFeedItem
          feedItem={myPost}
          namePressable={false}
          onEditPost={onEditPost}
        />,
        { initialState },
      );

      fireEvent(getByTestId('popupMenuButton'), 'onLongPress');
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
        0,
      );

      expect(navigatePush).toHaveBeenCalledWith(CREATE_POST_SCREEN, {
        post: storyPostItem.subject,
        communityId,
        onComplete: onEditPost,
      });
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('deletes post', async () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CommunityFeedItem
          feedItem={myPost}
          namePressable={false}
          onEditPost={onEditPost}
        />,
        { initialState },
      );

      // Used to fix unsupported subject type error
      if (storyPostItem.subject.__typename !== 'Post') {
        throw new Error('Subject type was not a Post');
      }

      fireEvent(getByTestId('popupMenuButton'), 'onLongPress');
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
        1,
      );
      await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

      expect(navigatePush).not.toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('communityFeedItems:delete.title'),
        i18next.t('communityFeedItems:delete.message'),
        [
          { text: i18next.t('cancel'), style: 'cancel' },
          {
            style: 'destructive',
            text: i18next.t('communityFeedItems:delete.buttonText'),
            onPress: expect.any(Function),
          },
        ],
      );
      expect(useMutation).toHaveBeenMutatedWith(DELETE_POST, {
        variables: { id: storyPostItem.subject.id },
      });
      expect(onEditPost).toHaveBeenCalledWith();
    });
  });

  describe('post written by other', () => {
    it('reports post', async () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CommunityFeedItem
          feedItem={storyPostItem}
          namePressable={false}
          onEditPost={onEditPost}
        />,
        { initialState },
      );

      // Used to fix unsupported subject type error
      if (storyPostItem.subject.__typename !== 'Post') {
        throw new Error('Subject type was not a Post');
      }

      fireEvent(getByTestId('popupMenuButton'), 'onLongPress');
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
        0,
      );
      await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

      expect(navigatePush).not.toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('communityFeedItems:report.title'),
        i18next.t('communityFeedItems:report.message'),
        [
          { text: i18next.t('cancel'), style: 'cancel' },
          {
            text: i18next.t('communityFeedItems:report.confirmButtonText'),
            onPress: expect.any(Function),
          },
        ],
      );
      expect(useMutation).toHaveBeenMutatedWith(REPORT_POST, {
        variables: { id: storyPostItem.subject.id },
      });
    });
  });
});

describe('clear notification button', () => {
  it('calls onClearNotification', () => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedItem
        feedItem={storyPostItem}
        onClearNotification={onClearNotification}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      { initialState },
    );

    fireEvent.press(getByTestId('ClearNotificationButton'));

    expect(onClearNotification).toHaveBeenCalledWith(storyPostItem);
  });
});

describe('add to steps button', () => {
  it('calls handleAddToMySteps', () => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedItem
        feedItem={mockFragment<CommunityFeedItemFragment>(
          COMMUNITY_FEED_ITEM_FRAGMENT,
          {
            mocks: {
              FeedItem: () => ({
                community: () => ({ id: communityId }),
                subject: () => ({
                  __typename: 'Post',
                  postType: PostTypeEnum.prayer_request,
                  stepStatus: PostStepStatusEnum.NONE,
                }),
              }),
            },
          },
        )}
        onClearNotification={onClearNotification}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      { initialState },
    );
    fireEvent.press(getByTestId('AddToMyStepsButton'));

    expect(navigatePush).toHaveBeenCalledWith(ADD_POST_TO_STEPS_SCREEN, {
      feedItemId: prayerPostItem.id,
      communityId,
    });
  });

  it('does not show addToMySteps button', () => {
    const { queryByTestId } = renderWithContext(
      <CommunityFeedItem
        feedItem={mockFragment<CommunityFeedItemFragment>(
          COMMUNITY_FEED_ITEM_FRAGMENT,
          {
            mocks: {
              FeedItem: () => ({
                community: () => ({ id: communityId }),
                subject: () => ({
                  __typename: 'Post',
                  postType: PostTypeEnum.prayer_request,
                  stepStatus: PostStepStatusEnum.INCOMPLETE,
                }),
              }),
            },
          },
        )}
        onClearNotification={onClearNotification}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      { initialState },
    );

    expect(queryByTestId('AddToMyStepsButton')).toBeFalsy();

    expect(navigatePush).not.toHaveBeenCalledWith(ADD_POST_TO_STEPS_SCREEN, {
      feedItemId: prayerPostItem.id,
      communityId,
    });
  });
});

describe('navigates to post type screen', () => {
  it('navigates', () => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedItem
        feedItem={storyPostItem}
        namePressable={false}
        onEditPost={onEditPost}
      />,
      { initialState },
    );
    fireEvent.press(getByTestId('STORYButton'));

    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_FEED_WITH_TYPE_SCREEN, {
      type: FeedItemSubjectTypeEnum.STORY,
      communityId,
      communityName,
    });
  });
});
