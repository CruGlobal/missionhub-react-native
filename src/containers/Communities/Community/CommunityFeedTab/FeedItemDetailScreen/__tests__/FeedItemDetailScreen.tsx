import 'react-native';
import React from 'react';
import MockDate from 'mockdate';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../../../testUtils';
import {
  ANALYTICS_PERMISSION_TYPE,
  ORG_PERMISSIONS,
} from '../../../../../../constants';
import { useKeyboardListeners } from '../../../../../../utils/hooks/useKeyboardListeners';
import CommentsList from '../../../../../CommentsList';
import { useAnalytics } from '../../../../../../utils/hooks/useAnalytics';
import {
  navigateBack,
  navigatePush,
} from '../../../../../../actions/navigation';
import FeedItemDetailScreen from '../FeedItemDetailScreen';
import FeedCommentBox from '../FeedCommentBox';
import { COMMUNITY_TABS } from '../../../constants';

jest.mock('../../../../../../utils/hooks/useKeyboardListeners');
jest.mock('../../../../../../selectors/organizations');
jest.mock('../../../../../../actions/navigation');
jest.mock('../../../../../CommentItem', () => 'CommentItem');
jest.mock('../../../../../../utils/hooks/useAnalytics');
jest.mock('lodash.debounce', () => jest.fn().mockImplementation(fn => fn));

MockDate.set('2019-04-12 12:00:00', 300);

const myId = 'myId';
const communityId = '24234234';
const feedItemId = '1';
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
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigatePush' });
});

it('renders loading', () => {
  renderWithContext(<FeedItemDetailScreen />, {
    initialState,
    navParams: { feedItemId, communityId },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'detail'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
  expect(navigateBack).not.toHaveBeenCalled();
});

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<FeedItemDetailScreen />, {
    initialState,
    navParams: { feedItemId, communityId },
  });

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'detail'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
  expect(navigateBack).not.toHaveBeenCalled();
});

describe('refresh', () => {
  it('calls refreshComments', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <FeedItemDetailScreen />,
      {
        initialState,
        navParams: { feedItemId, communityId },
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
    expect(navigateBack).toHaveBeenCalled();
  });
  it('goes to community tabs', async () => {
    const { getByTestId } = renderWithContext(<FeedItemDetailScreen />, {
      initialState,
      navParams: { feedItemId, communityId, fromNotificationCenterItem: true },
    });
    await flushMicrotasksQueue();

    fireEvent.press(getByTestId('CommunityNameHeader'));
    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_TABS, { communityId });
  });
});

describe('celebrate add complete', () => {
  it('scrolls to end on add complete', async () => {
    const scrollToEnd = jest.fn();

    const { getByType } = renderWithContext(<FeedItemDetailScreen />, {
      initialState,
      navParams: { feedItemId, communityId },
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
      navParams: { feedItemId, communityId },
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
