import 'react-native';
import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { organizationSelector } from '../../../selectors/organizations';
import { useKeyboardListeners } from '../../../utils/hooks/useKeyboardListeners';
import {
  reloadCelebrateComments,
  resetCelebrateEditingComment,
} from '../../../actions/celebrateComments';
import CommentsList from '../../CommentsList';
import { celebrateCommentsSelector } from '../../../selectors/celebrateComments';
import { Organization } from '../../../reducers/organizations';
import { CelebrateComment } from '../../../reducers/celebrateComments';
import { CELEBRATE_ITEM_FRAGMENT } from '../../../components/CelebrateItem/queries';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem } from '../../CelebrateFeed/__generated__/GetCelebrateFeed';

import CelebrateDetailScreen from '..';

jest.mock('../../../utils/hooks/useKeyboardListeners');
jest.mock('../../../selectors/celebration');
jest.mock('../../../selectors/celebrateComments');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/celebrateComments');
jest.mock('../../Analytics', () => 'Analytics');
jest.mock('../../CommentItem', () => 'CommentItem');
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
const event = mockFragment<CelebrateItem>(CELEBRATE_ITEM_FRAGMENT);
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
  ((celebrateCommentsSelector as unknown) as jest.Mock).mockReturnValue(
    comments,
  );
});

it('renders correctly', () => {
  renderWithContext(<CelebrateDetailScreen />, {
    initialState,
    navParams: { event, orgId },
  }).snapshot();

  expect(organizationSelector).toHaveBeenCalledWith(
    { organizations },
    { orgId },
  );
  expect(celebrateCommentsSelector).toHaveBeenCalledWith(
    {
      celebrateComments,
    },
    { eventId: event.id },
  );
});

describe('refresh', () => {
  it('calls refreshComments', () => {
    const { getByTestId } = renderWithContext(<CelebrateDetailScreen />, {
      initialState,
      navParams: { event, orgId },
    });

    fireEvent(getByTestId('RefreshControl'), 'onRefresh');

    expect(reloadCelebrateComments).toHaveBeenCalledWith(
      event.id,
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
        navParams: { event, orgId },
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
      navParams: { event, orgId },
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
      navParams: { event, orgId },
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
      navParams: { event, orgId },
    });

    getByType(
      CommentsList,
    ).props.listProps.ref.current.scrollToEnd = scrollToEnd;

    onShowKeyboard();

    expect(scrollToEnd).toHaveBeenCalledWith();
  });
});
