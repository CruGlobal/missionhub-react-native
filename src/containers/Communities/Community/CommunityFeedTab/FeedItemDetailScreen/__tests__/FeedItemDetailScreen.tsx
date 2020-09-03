import 'react-native';
import React from 'react';
import MockDate from 'mockdate';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../../../testUtils';
import {
  ORG_PERMISSIONS,
  GLOBAL_COMMUNITY_ID,
} from '../../../../../../constants';
import { useKeyboardListeners } from '../../../../../../utils/hooks/useKeyboardListeners';
import CommentsList from '../../../../../CommentsList';
import { useAnalytics } from '../../../../../../utils/hooks/useAnalytics';
import {
  navigateBack,
  navigateToCommunityFeed,
} from '../../../../../../actions/navigation';
import FeedItemDetailScreen from '../FeedItemDetailScreen';
import FeedCommentBox from '../FeedCommentBox';
import { PermissionEnum } from '../../../../../../../__generated__/globalTypes';

jest.mock('../../../../../../utils/hooks/useKeyboardListeners');
jest.mock('../../../../../../selectors/organizations');
jest.mock('../../../../../../actions/navigation');
jest.mock('../../../../../CommentItem', () => 'CommentItem');
jest.mock('../../../../../../utils/hooks/useAnalytics');
jest.mock('lodash.debounce', () => jest.fn().mockImplementation(fn => fn));
jest.mock('../../../../../../auth/authStore', () => ({
  isAuthenticated: () => true,
}));

MockDate.set('2019-04-12 12:00:00');

const myId = 'myId';
const notMyId = 'notMyId';
const communityId = '24234234';
const feedItemId = '1';
const personId = '2';
const auth = {
  person: {
    id: myId,
    organizational_permissions: [
      { organization_id: communityId, permission_id: ORG_PERMISSIONS.USER },
    ],
  },
};

const initialState = { auth };

let onShowKeyboard: () => void;

beforeEach(() => {
  (useKeyboardListeners as jest.Mock).mockImplementation(
    ({ onShow }: { onShow: () => void }) => (onShowKeyboard = onShow),
  );
  (navigateBack as jest.Mock).mockReturnValue({ type: 'navigateBack' });
  (navigateToCommunityFeed as jest.Mock).mockReturnValue({
    type: 'navigateToCommunityFeed',
  });
});

it('renders loading', () => {
  renderWithContext(<FeedItemDetailScreen />, {
    initialState,
    navParams: { feedItemId },
  }).snapshot();

  expect(navigateBack).not.toHaveBeenCalled();
});

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<FeedItemDetailScreen />, {
    initialState,
    navParams: { feedItemId },
    mocks: {
      FeedItem: () => ({
        subjectPerson: () => ({ id: personId }),
        community: () => ({ id: communityId }),
      }),
    },
  });

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'detail'], {
    assignmentType: { personId: undefined, communityId: undefined },
    permissionType: { communityId: undefined },
    triggerTracking: false,
  });

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'detail'], {
    assignmentType: { personId, communityId },
    permissionType: { communityId },
    triggerTracking: true,
  });
  expect(navigateBack).not.toHaveBeenCalled();
});

it('renders correctly with communityId passed in', async () => {
  const { snapshot } = renderWithContext(<FeedItemDetailScreen />, {
    initialState,
    navParams: { feedItemId, communityId },
    mocks: {
      FeedItem: () => ({
        subjectPerson: () => ({ id: personId }),
        community: () => ({ id: communityId }),
      }),
    },
  });

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'detail'], {
    assignmentType: { personId: undefined, communityId },
    permissionType: { communityId },
    triggerTracking: false,
  });

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'detail'], {
    assignmentType: { personId, communityId },
    permissionType: { communityId },
    triggerTracking: true,
  });
  expect(navigateBack).not.toHaveBeenCalled();
});

describe('refresh', () => {
  it('calls refreshComments', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <FeedItemDetailScreen />,
      {
        initialState,
        navParams: { feedItemId },
      },
    );
    await flushMicrotasksQueue();
    recordSnapshot();

    fireEvent(getByTestId('RefreshControl'), 'onRefresh');

    await flushMicrotasksQueue();
    diffSnapshot();
  });
});

describe('nav on community name', () => {
  it('calls navigate back', async () => {
    const { getByTestId } = renderWithContext(<FeedItemDetailScreen />, {
      initialState,
      navParams: { feedItemId, communityId },
    });
    await flushMicrotasksQueue();

    fireEvent.press(getByTestId('CommunityNameHeader'));
    expect(navigateBack).toHaveBeenCalledWith();
  });

  it('goes to community tabs', async () => {
    const { getByTestId } = renderWithContext(<FeedItemDetailScreen />, {
      initialState,
      navParams: { feedItemId, communityId, fromNotificationCenterItem: true },
    });
    await flushMicrotasksQueue();

    fireEvent.press(getByTestId('CommunityNameHeader'));
    expect(navigateToCommunityFeed).toHaveBeenCalledWith(communityId);
  });

  it('goes to global community tabs', async () => {
    const { getByTestId } = renderWithContext(<FeedItemDetailScreen />, {
      initialState,
      navParams: { feedItemId, fromNotificationCenterItem: true },
      mocks: {
        FeedItem: () => ({
          community: () => null,
        }),
      },
    });
    await flushMicrotasksQueue();

    fireEvent.press(getByTestId('CommunityNameHeader'));
    expect(navigateToCommunityFeed).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
  });
});

describe('edit/delete post', () => {
  it('no options for not my post', async () => {
    const { snapshot } = renderWithContext(<FeedItemDetailScreen />, {
      initialState,
      navParams: { feedItemId, communityId },
      mocks: {
        FeedItem: () => ({
          community: () => ({
            id: communityId,
            people: () => ({
              edges: () => [
                { communityPermission: { permission: PermissionEnum.user } },
              ],
            }),
          }),
          subjectPerson: () => ({ id: notMyId }),
        }),
      },
    });
    await flushMicrotasksQueue();
    snapshot();
  });
  it('edit and delete for my post', async () => {
    const { snapshot } = renderWithContext(<FeedItemDetailScreen />, {
      initialState,
      navParams: { feedItemId, communityId },
      mocks: {
        FeedItem: () => ({
          community: () => ({
            id: communityId,
            people: () => ({
              edges: () => [
                { communityPermission: { permission: PermissionEnum.user } },
              ],
            }),
          }),
          subjectPerson: () => ({ id: myId }),
        }),
        User: () => ({ person: () => ({ id: myId }) }),
      },
    });
    await flushMicrotasksQueue();
    snapshot();
  });
  it('delete for admin and not my post', async () => {
    const { snapshot } = renderWithContext(<FeedItemDetailScreen />, {
      initialState,
      navParams: { feedItemId, communityId },
      mocks: {
        FeedItem: () => ({
          community: () => ({
            id: communityId,
            people: () => ({
              edges: () => [
                { communityPermission: { permission: PermissionEnum.admin } },
              ],
            }),
          }),
          subjectPerson: () => ({ id: notMyId }),
        }),
      },
    });
    await flushMicrotasksQueue();
    snapshot();
  });
});

describe('celebrate add complete', () => {
  it('scrolls to end on add complete', async () => {
    const scrollToEnd = jest.fn();

    const { getByType } = renderWithContext(<FeedItemDetailScreen />, {
      initialState,
      navParams: { feedItemId },
    });

    await flushMicrotasksQueue();

    const commentsListProps = getByType(CommentsList).props;
    commentsListProps.listProps.ref.current.scrollToEnd = scrollToEnd;

    fireEvent(getByType(FeedCommentBox), 'onAddComplete');

    commentsListProps.listProps.onContentSizeChange();

    expect(scrollToEnd).toHaveBeenCalledWith();
  });
});

describe('keyboard show', () => {
  it('without editing comment', async () => {
    const scrollToEnd = jest.fn();

    const { getByType } = renderWithContext(<FeedItemDetailScreen />, {
      initialState,
      navParams: { feedItemId },
    });

    await flushMicrotasksQueue();

    getByType(
      CommentsList,
    ).props.listProps.ref.current.scrollToEnd = scrollToEnd;

    onShowKeyboard();

    expect(scrollToEnd).toHaveBeenCalledWith();
  });

  it('with editing comment', async () => {
    const scrollToIndex = jest.fn();

    const { getByType } = renderWithContext(<FeedItemDetailScreen />, {
      initialState,
      navParams: { feedItemId },
    });

    await flushMicrotasksQueue();

    const commentsListProps = getByType(CommentsList).props;
    commentsListProps.listProps.ref.current.scrollToIndex = scrollToIndex;
    commentsListProps.setEditingCommentId(commentsListProps.comments[1].id);

    onShowKeyboard();

    expect(scrollToIndex).toHaveBeenCalledWith({
      index: 1,
      viewPosition: 1,
    });
  });
});
