/*eslint max-lines: 0 */

import React from 'react';
import { Alert, ActionSheetIOS } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import MockDate from 'mockdate';
import i18next from 'i18next';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { CELEBRATE_DETAIL_SCREEN } from '../../../containers/CelebrateDetailScreen';
import { CREATE_POST_SCREEN } from '../../../containers/Groups/CreatePostScreen';
import {
  COMMUNITY_FEED_ITEM_FRAGMENT,
  COMMUNITY_FEED_POST_FRAGMENT,
  COMMUNITY_FEED_STEP_FRAGMENT,
  COMMUNITY_FEED_CHALLENGE_FRAGMENT,
  COMMUNITY_PERSON_FRAGMENT,
} from '../queries';
import { CommunityFeedItem as CommunityFeedItemFragment } from '../../CommunityFeedItem/__generated__/CommunityFeedItem';
import { CommunityPerson } from '../../CommunityFeedItem/__generated__/CommunityPerson';
import { CommunityFeedStep } from '../__generated__/CommunityFeedStep';
import { CommunityFeedChallenge } from '../__generated__/CommunityFeedChallenge';
import { CommunityFeedPost } from '../__generated__/CommunityFeedPost';
import {
  PostTypeEnum,
  RelationshipTypeEnum,
} from '../../../../__generated__/globalTypes';
import {
  DELETE_POST,
  REPORT_POST,
  GET_PERSON_AND_PERMISSIONS,
} from '../queries';

import { CommunityFeedItem } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../Avatar', () => 'Avatar');
jest.mock('../../Card', () => 'Card');

const communityId = '3';

const mePerson = mockFragment<CommunityPerson>(COMMUNITY_PERSON_FRAGMENT);
const myId = mePerson.id;

const prayerPostSubject = mockFragment<CommunityFeedPost>(
  COMMUNITY_FEED_POST_FRAGMENT,
  {
    mocks: {
      Post: () => ({
        postType: () => PostTypeEnum.prayer_request,
      }),
    },
  },
);
const storyPostSubject = mockFragment<CommunityFeedPost>(
  COMMUNITY_FEED_POST_FRAGMENT,
  {
    mocks: {
      Post: () => ({
        postType: () => PostTypeEnum.story,
      }),
    },
  },
);
const stepSubject = mockFragment<CommunityFeedStep>(
  COMMUNITY_FEED_STEP_FRAGMENT,
);
const challengeSubject = mockFragment<CommunityFeedChallenge>(
  COMMUNITY_FEED_CHALLENGE_FRAGMENT,
);

const item = mockFragment<CommunityFeedItemFragment>(
  COMMUNITY_FEED_ITEM_FRAGMENT,
);
const prayerPostItem = { ...item, subject: prayerPostSubject };
const storyPostItem = { ...item, subject: storyPostSubject };
const stepItem = { ...item, subject: stepSubject };
const challengeItem = { ...item, subject: challengeSubject };

MockDate.set('2019-08-21 12:00:00', 300);

let onRefresh = jest.fn();
let onClearNotification = jest.fn();

const trackActionResult = { type: 'tracked plain action' };
const navigatePushResult = { type: 'navigate push' };

const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  onRefresh = jest.fn();
  onClearNotification = jest.fn();
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
});

describe('global community', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        item={stepItem}
        onRefresh={onRefresh}
        communityId={GLOBAL_COMMUNITY_ID}
        namePressable={false}
      />,
      {
        initialState,
        mocks: {
          Person: () => ({
            relationshipType: RelationshipTypeEnum.family,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_PERSON_AND_PERMISSIONS, {
      variables: { id: stepItem.subjectPerson?.id },
      skip: false,
    });
  });

  it('renders with clear notification button correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        item={stepItem}
        onRefresh={onRefresh}
        communityId={GLOBAL_COMMUNITY_ID}
        namePressable={false}
        onClearNotification={onClearNotification}
      />,
      {
        initialState,
        mocks: {
          Person: () => ({
            relationshipType: RelationshipTypeEnum.family,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_PERSON_AND_PERMISSIONS, {
      variables: { id: stepItem.subjectPerson?.id },
      skip: false,
    });
  });

  it('renders post item correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        item={storyPostItem}
        onRefresh={onRefresh}
        communityId={GLOBAL_COMMUNITY_ID}
        namePressable={false}
      />,
      {
        initialState,
        mocks: {
          Person: () => ({
            relationshipType: RelationshipTypeEnum.family,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_PERSON_AND_PERMISSIONS, {
      variables: { id: storyPostItem.subjectPerson?.id },
      skip: false,
    });
  });
});

describe('Community', () => {
  it('renders post correctly without add to steps button ', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        item={storyPostItem}
        onRefresh={onRefresh}
        communityId={communityId}
        namePressable={false}
      />,
      {
        initialState,
        mocks: {
          Person: () => ({
            relationshipType: RelationshipTypeEnum.family,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_PERSON_AND_PERMISSIONS, {
      variables: { id: storyPostItem.subjectPerson?.id },
      skip: false,
    });
  });

  it('renders post correctly with add to steps button', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        item={prayerPostItem}
        onRefresh={onRefresh}
        communityId={communityId}
        namePressable={false}
      />,
      {
        initialState,
        mocks: {
          Person: () => ({
            relationshipType: RelationshipTypeEnum.family,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_PERSON_AND_PERMISSIONS, {
      variables: { id: prayerPostItem.subjectPerson?.id },
      skip: false,
    });
  });

  it('renders step correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        item={stepItem}
        onRefresh={onRefresh}
        communityId={communityId}
        namePressable={false}
      />,
      {
        initialState,
        mocks: {
          Person: () => ({
            relationshipType: RelationshipTypeEnum.family,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_PERSON_AND_PERMISSIONS, {
      variables: { id: stepItem.subjectPerson?.id },
      skip: false,
    });
  });

  it('renders challenge correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        item={challengeItem}
        onRefresh={onRefresh}
        communityId={communityId}
        namePressable={false}
      />,
      {
        initialState,
        mocks: {
          Person: () => ({
            relationshipType: RelationshipTypeEnum.family,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_PERSON_AND_PERMISSIONS, {
      variables: { id: challengeItem.subjectPerson?.id },
      skip: false,
    });
  });

  it('renders with clear notification button correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeedItem
        item={storyPostItem}
        onRefresh={onRefresh}
        communityId={communityId}
        onClearNotification={onClearNotification}
        namePressable={false}
      />,
      {
        initialState,
        mocks: {
          Person: () => ({
            relationshipType: RelationshipTypeEnum.family,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_PERSON_AND_PERMISSIONS, {
      variables: { id: storyPostItem.subjectPerson?.id },
      skip: false,
    });
  });
});

it('renders with name pressable correctly', async () => {
  const { snapshot } = renderWithContext(
    <CommunityFeedItem
      item={storyPostItem}
      onRefresh={onRefresh}
      communityId={communityId}
      namePressable={true}
    />,
    {
      initialState,
      mocks: {
        Person: () => ({
          relationshipType: RelationshipTypeEnum.family,
        }),
      },
    },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_PERSON_AND_PERMISSIONS, {
    variables: { id: storyPostItem.subjectPerson?.id },
    skip: false,
  });
});

describe('press card', () => {
  it('not pressable in global community', async () => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedItem
        item={stepItem}
        onRefresh={onRefresh}
        communityId={GLOBAL_COMMUNITY_ID}
        namePressable={false}
      />,
      { initialState },
    );
    await flushMicrotasksQueue();
    expect(getByTestId('CommunityFeedItem').props.onPress).toEqual(undefined);
  });

  it('navigates to celebrate detail screen', async () => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedItem
        item={stepItem}
        onRefresh={onRefresh}
        communityId={communityId}
        namePressable={false}
      />,
      { initialState },
    );
    await flushMicrotasksQueue();
    fireEvent.press(getByTestId('CommunityFeedItem'));

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATE_DETAIL_SCREEN, {
      item: stepItem,
      orgId: communityId,
      onRefreshCelebrateItem: onRefresh,
    });
  });
});

describe('long-press card', () => {
  describe('post written by me', () => {
    const myPost: CommunityFeedItemFragment = {
      ...storyPostItem,
      subjectPerson: mePerson,
    };

    it('navigates to edit post screen', async () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CommunityFeedItem
          item={myPost}
          onRefresh={onRefresh}
          communityId={communityId}
          namePressable={false}
        />,
        { initialState },
      );
      await flushMicrotasksQueue();

      fireEvent(getByTestId('popupMenuButton'), 'onLongPress');
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
        0,
      );

      expect(navigatePush).toHaveBeenCalledWith(CREATE_POST_SCREEN, {
        post: storyPostSubject,
        onComplete: onRefresh,
        communityId,
      });
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('deletes post', async () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CommunityFeedItem
          item={myPost}
          onRefresh={onRefresh}
          communityId={communityId}
          namePressable={false}
        />,
        { initialState },
      );
      await flushMicrotasksQueue();
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
          { text: i18next.t('cancel') },
          {
            text: i18next.t('communityFeedItems:delete.buttonText'),
            onPress: expect.any(Function),
          },
        ],
      );
      expect(useMutation).toHaveBeenMutatedWith(DELETE_POST, {
        variables: { id: storyPostSubject.id },
      });
      expect(onRefresh).toHaveBeenCalled();
    });
  });

  describe('post written by other', () => {
    it('reports post', async () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CommunityFeedItem
          item={storyPostItem}
          onRefresh={onRefresh}
          communityId={communityId}
          namePressable={false}
        />,
        { initialState },
      );
      await flushMicrotasksQueue();
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
          { text: i18next.t('cancel') },
          {
            text: i18next.t('communityFeedItems:report.confirmButtonText'),
            onPress: expect.any(Function),
          },
        ],
      );
      expect(useMutation).toHaveBeenMutatedWith(REPORT_POST, {
        variables: { id: storyPostSubject.id },
      });
    });
  });
});

describe('clear notification button', () => {
  it('calls onClearNotification', async () => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedItem
        item={storyPostItem}
        onRefresh={onRefresh}
        communityId={communityId}
        onClearNotification={onClearNotification}
        namePressable={false}
      />,
      { initialState },
    );
    await flushMicrotasksQueue();
    fireEvent.press(getByTestId('ClearNotificationButton'));

    expect(onClearNotification).toHaveBeenCalledWith(storyPostItem);
  });
});
