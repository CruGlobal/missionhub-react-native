import 'react-native';
import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../../../testUtils';
import {
  ANALYTICS_ASSIGNMENT_TYPE,
  ORG_PERMISSIONS,
  ANALYTICS_PERMISSION_TYPE,
} from '../../../../../../constants';
import { mockFragment } from '../../../../../../../testUtils/apolloMockClient';
import { organizationSelector } from '../../../../../../selectors/organizations';
import { orgPermissionSelector } from '../../../../../../selectors/people';
import { useKeyboardListeners } from '../../../../../../utils/hooks/useKeyboardListeners';
import {
  reloadCelebrateComments,
  resetCelebrateEditingComment,
} from '../../../../../../actions/celebrateComments';
import CommentsList from '../../../../../CommentsList';
import { celebrateCommentsSelector } from '../../../../../../selectors/celebrateComments';
import { Organization } from '../../../../../../reducers/organizations';
import { CelebrateComment } from '../../../../../../reducers/celebrateComments';
import { COMMUNITY_FEED_ITEM_FRAGMENT } from '../../../../../../components/CommunityFeedItem/queries';
import { useAnalytics } from '../../../../../../utils/hooks/useAnalytics';
import { CommunityFeedItem } from '../../../../../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { navigateBack } from '../../../../../../actions/navigation';
import CelebrateDetailScreen from '../FeedItemDetailScreen';

jest.mock('../../../utils/hooks/useKeyboardListeners');
jest.mock('../../../selectors/celebration');
jest.mock('../../../selectors/celebrateComments');
jest.mock('../../../selectors/organizations');
jest.mock('../../../selectors/people');
jest.mock('../../../actions/celebrateComments');
jest.mock('../../../actions/navigation');
jest.mock('../../CommentItem', () => 'CommentItem');
jest.mock('../../../utils/hooks/useAnalytics');
jest.useFakeTimers();

MockDate.set('2019-04-12 12:00:00', 300);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const comments: { comments: CelebrateComment[]; pagination: any } = {
  comments: [
    {
      id: 'comment1',
      person: { first_name: 'Person', last_name: '1' },
      content: 'some comment',
      created_at: '2019-04-11T13:51:49.888',
      updated_at: '2019-04-11T13:51:49.888',
    },
    {
      id: 'comment2',
      person: { first_name: 'Person', last_name: '2' },
      content: 'some comment',
      created_at: '2019-04-11T13:51:49.888',
      updated_at: '2019-04-11T13:51:49.888',
    },
  ],
  pagination: {},
};

const myId = 'myId';
const orgId = '24234234';
const organization: Organization = { id: orgId, name: 'Community' };
const orgPermission = { id: '222', permission_id: ORG_PERMISSIONS.USER };
const item = mockFragment<CommunityFeedItem>(COMMUNITY_FEED_ITEM_FRAGMENT);
const organizations = [organization];
const celebrateComments = { editingCommentId: null };
const auth = { person: { id: myId } };

const initialState = {
  organizations,
  celebrateComments,
  auth,
};

let onShowKeyboard: () => void;

beforeEach(() => {
  (useKeyboardListeners as jest.Mock).mockImplementation(
    ({ onShow }: { onShow: () => void }) => (onShowKeyboard = onShow),
  );
  (reloadCelebrateComments as jest.Mock).mockReturnValue({
    type: 'reloadCelebrateComments',
  });
  (resetCelebrateEditingComment as jest.Mock).mockReturnValue({
    type: 'resetCelebrateEditingComment',
  });
  ((organizationSelector as unknown) as jest.Mock).mockReturnValue(
    organization,
  );
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    orgPermission,
  );
  ((celebrateCommentsSelector as unknown) as jest.Mock).mockReturnValue(
    comments,
  );
  (navigateBack as jest.Mock).mockReturnValue({ type: 'navigateBack' });
});

it('renders correctly', () => {
  renderWithContext(<CelebrateDetailScreen />, {
    initialState,
    navParams: { item, orgId },
  }).snapshot();

  expect(organizationSelector).toHaveBeenCalledWith(
    { organizations },
    { orgId },
  );
  expect(orgPermissionSelector).toHaveBeenCalledWith(
    {},
    { person: item.subjectPerson, organization },
  );
  expect(celebrateCommentsSelector).toHaveBeenCalledWith(
    {
      celebrateComments,
    },
    { eventId: item.id },
  );
  expect(useAnalytics).toHaveBeenCalledWith(['celebrate item', 'comments'], {
    screenContext: {
      [ANALYTICS_ASSIGNMENT_TYPE]: 'community member',
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
  expect(navigateBack).not.toHaveBeenCalled();
});

it('should navigate back if event only contains an id', () => {
  renderWithContext(<CelebrateDetailScreen />, {
    initialState,
    navParams: { item: { id: '1' }, orgId },
  });

  expect(navigateBack).toHaveBeenCalled();
});

describe('refresh', () => {
  it('calls refreshComments', () => {
    const { getByTestId } = renderWithContext(<CelebrateDetailScreen />, {
      initialState,
      navParams: { item, orgId },
    });

    fireEvent(getByTestId('RefreshControl'), 'onRefresh');

    expect(reloadCelebrateComments).toHaveBeenCalledWith(
      item.id,
      organization.id,
    );
  });
});

describe('celebrate add complete', () => {
  it('scrolls to end on add complete', () => {
    const scrollToEnd = jest.fn();

    const { getByType, getByTestId } = renderWithContext(
      <CelebrateDetailScreen />,
      {
        initialState,
        navParams: { item, orgId },
      },
    );

    getByType(
      CommentsList,
    ).props.listProps.ref.current.scrollToEnd = scrollToEnd;

    fireEvent(getByTestId('CelebrateCommentBox'), 'onAddComplete');

    expect(scrollToEnd).toHaveBeenCalledWith();
  });
});

describe('keyboard show', () => {
  it('without editing comment', () => {
    const scrollToEnd = jest.fn();

    const { getByType } = renderWithContext(<CelebrateDetailScreen />, {
      initialState,
      navParams: { item, orgId },
    });

    getByType(
      CommentsList,
    ).props.listProps.ref.current.scrollToEnd = scrollToEnd;

    onShowKeyboard();

    expect(scrollToEnd).toHaveBeenCalledWith();
  });

  it('with editing comment', () => {
    const scrollToIndex = jest.fn();

    const { getByType } = renderWithContext(<CelebrateDetailScreen />, {
      initialState: {
        ...initialState,
        celebrateComments: { editingCommentId: comments.comments[1].id },
      },
      navParams: { item, orgId },
    });

    getByType(
      CommentsList,
    ).props.listProps.ref.current.scrollToIndex = scrollToIndex;

    onShowKeyboard();

    expect(scrollToIndex).toHaveBeenCalledWith({
      index: 1,
      viewPosition: 1,
    });
  });

  it('with editing comment that doesnt exist', () => {
    const scrollToEnd = jest.fn();

    const { getByType } = renderWithContext(<CelebrateDetailScreen />, {
      initialState: {
        ...initialState,
        celebrateComments: { editingCommentId: 'doesnt exist' },
      },
      navParams: { item, orgId },
    });

    getByType(
      CommentsList,
    ).props.listProps.ref.current.scrollToEnd = scrollToEnd;

    onShowKeyboard();

    expect(scrollToEnd).toHaveBeenCalledWith();
  });
});
