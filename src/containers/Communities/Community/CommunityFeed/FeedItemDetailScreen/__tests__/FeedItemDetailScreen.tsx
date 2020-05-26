import 'react-native';
import React from 'react';
import MockDate from 'mockdate';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../../../testUtils';
import {
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_PERMISSION_TYPE,
} from '../../../../../../constants';
import { useKeyboardListeners } from '../../../../../../utils/hooks/useKeyboardListeners';
import CommentsList from '../../../../../CommentsList';
import { Organization } from '../../../../../../reducers/organizations';
import { useAnalytics } from '../../../../../../utils/hooks/useAnalytics';
import { navigateBack } from '../../../../../../actions/navigation';
import FeedItemDetailScreen from '../FeedItemDetailScreen';
import FeedCommentBox from '../FeedCommentBox';

jest.mock('../../../../../../utils/hooks/useKeyboardListeners');
jest.mock('../../../../../../selectors/organizations');
jest.mock('../../../../../../selectors/people');
jest.mock('../../../../../../actions/navigation');
jest.mock('../../../../../CommentItem', () => 'CommentItem');
jest.mock('../../../../../../utils/hooks/useAnalytics');
jest.mock('lodash.debounce', () => jest.fn().mockImplementation(fn => fn));

MockDate.set('2019-04-12 12:00:00', 300);

const myId = 'myId';
const orgId = '24234234';
const organization: Organization = { id: orgId, name: 'Community' };
const feedItemId = '1';
const organizations = [organization];
const auth = { person: { id: myId } };

const initialState = {
  organizations,
  auth,
};

let onShowKeyboard: () => void;

beforeEach(() => {
  (useKeyboardListeners as jest.Mock).mockImplementation(
    ({ onShow }: { onShow: () => void }) => (onShowKeyboard = onShow),
  );
  (navigateBack as jest.Mock).mockReturnValue({ type: 'navigateBack' });
});

it('renders loading', () => {
  renderWithContext(<FeedItemDetailScreen />, {
    initialState,
    navParams: { feedItemId },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['celebrate item', 'comments'], {
    screenContext: {
      [ANALYTICS_ASSIGNMENT_TYPE]: 'community member',
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
  expect(navigateBack).not.toHaveBeenCalled();
});

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<FeedItemDetailScreen />, {
    initialState,
    navParams: { feedItemId },
  });

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['celebrate item', 'comments'], {
    screenContext: {
      [ANALYTICS_ASSIGNMENT_TYPE]: 'community member',
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
