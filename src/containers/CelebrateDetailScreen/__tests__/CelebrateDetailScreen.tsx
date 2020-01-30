import 'react-native';
import React from 'react';
import * as react from 'react';
import { FlatList } from 'react-native';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { organizationSelector } from '../../../selectors/organizations';
import { useKeyboardListeners } from '../../../utils/hooks/useKeyboardListeners';
import {
  reloadCelebrateComments,
  resetCelebrateEditingComment,
} from '../../../actions/celebrateComments';
import { celebrateCommentsSelector } from '../../../selectors/celebrateComments';
import { Organization } from '../../../reducers/organizations';
import { CelebrateComment } from '../../../reducers/celebrateComments';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../../CelebrateFeed/__generated__/GetCelebrateFeed';

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

const comments = {
  comments: [
    {
      id: 'comment1',
      person: { first_name: 'Person', last_name: '1' },
      content: 'some comment',
      created_at: '2019-04-11T13:51:49.888',
    },
    {
      id: 'comment2',
      person: { first_name: 'Person', last_name: '2' },
      content: 'some comment',
      created_at: '2019-04-11T13:51:49.888',
    },
  ],
  pagination: {},
};

const myId = 'myId';
const orgId = '24234234';
const organization: Organization = { id: orgId };
const event: GetCelebrateFeed_community_celebrationItems_nodes = {
  __typename: 'CommunityCelebrationItem',
  id: '90001',
  adjectiveAttributeName: null,
  adjectiveAttributeValue: null,
  celebrateableId: '',
  celebrateableType: '',
  changedAttributeName: '',
  changedAttributeValue: '2019-04-11T13:51:49.888',
  commentsCount: 0,
  liked: false,
  likesCount: 0,
  objectDescription: '',
  subjectPerson: null,
  subjectPersonName: 'Roger',
};
const organizations = [organization];
const celebrateComments = { editingCommentId: null };
const auth = { person: { id: myId } };

const initialState = {
  organizations,
  celebrateComments,
  auth,
};
let listRef: FlatList<CelebrateComment> | null;
let onShowKeyboard: () => void;

beforeEach(() => {
  (react.useRef as jest.Mock).mockImplementation(
    (ref: FlatList<CelebrateComment> | null) => (listRef = ref),
  );
  (useKeyboardListeners as jest.Mock).mockImplementation(
    (onShow: () => void) => (onShowKeyboard = onShow),
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

    expect(reloadCelebrateComments).toHaveBeenCalledWith(event);
  });
});

describe('celebrate add complete', () => {
  fit('scrolls to end on add complete', () => {
    const { getByTestId } = renderWithContext(<CelebrateDetailScreen />, {
      initialState,
      navParams: { event, orgId },
    });

    fireEvent(getByTestId('CommentBox'), 'onAddComplete');

    expect(listRef.current.scrollToEnd).toHaveBeenCalledWith();
  });
});

describe('keyboard show', () => {
  it('without editing comment', () => {
    renderWithContext(<CelebrateDetailScreen />, {
      initialState,
      navParams: { event, orgId },
    });

    onShowKeyboard();

    expect(listRef.current.scrollToEnd).toHaveBeenCalledWith();
  });

  it('with editing comment', () => {
    renderWithContext(<CelebrateDetailScreen />, {
      initialState: {
        ...initialState,
        celebrateComments: { editingCommentId: comments.comments[0].id },
      },
      navParams: { event, orgId },
    });

    onShowKeyboard();

    expect(listRef.current.scrollToIndex).toHaveBeenCalledWith({
      index: 0,
      viewPosition: 1,
    });
  });
  it('with editing comment that doesnt exist', () => {
    renderWithContext(<CelebrateDetailScreen />, {
      initialState: {
        ...initialState,
        celebrateComments: { editingCommentId: 'doesnt exist' },
      },
      navParams: { event, orgId },
    });

    onShowKeyboard();

    expect(listRef.current.scrollToEnd).toHaveBeenCalledWith();
  });
});
