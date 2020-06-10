import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../../../../../testUtils';
import { mockFragment } from '../../../../../../../../testUtils/apolloMockClient';
import { AVATAR_FRAGMENT } from '../../../../../../../components/Avatar/queries';
import { Avatar } from '../../../../../../../components/Avatar/__generated__/Avatar';
import {
  CREATE_FEED_ITEM_COMMENT_MUTATION,
  FEED_ITEM_EDITING_COMMENT_FRAGMENT,
  UPDATE_FEED_ITEM_COMMENT_MUTATION,
} from '../queries';
import { FeedItemEditingComment } from '../__generated__/FeedItemEditingComment';

import FeedCommentBox from '..';

const feedItemId = '1';
const avatarPerson = mockFragment<Avatar>(AVATAR_FRAGMENT);
const editingComment = mockFragment<FeedItemEditingComment>(
  FEED_ITEM_EDITING_COMMENT_FRAGMENT,
);

const onAddComplete = jest.fn();
const onCancel = jest.fn();
const initialState = {
  auth: {
    person: { id: '1' },
  },
};

function render() {
  return renderWithContext(
    <FeedCommentBox
      feedItemId={feedItemId}
      avatarPerson={avatarPerson}
      onAddComplete={onAddComplete}
      onCancel={onCancel}
    />,
    { initialState },
  );
}

it('renders correctly', () => {
  render().snapshot();
});

describe('onSubmit', () => {
  it('creates comment with add', async () => {
    const content = 'New comment';
    const { getByTestId } = render();

    await fireEvent(getByTestId('FeedItemCommentBox'), 'onSubmit', content);

    expect(useMutation).toHaveBeenMutatedWith(
      CREATE_FEED_ITEM_COMMENT_MUTATION,
      { variables: { feedItemId, content } },
    );
    expect(onAddComplete).toHaveBeenCalled();
  });
});

it('renders editing correctly', () => {
  renderWithContext(
    <FeedCommentBox
      editingComment={editingComment}
      feedItemId={feedItemId}
      avatarPerson={avatarPerson}
      onAddComplete={onAddComplete}
      onCancel={onCancel}
    />,
    {
      initialState,
    },
  ).snapshot();
});

it('onCancel', () => {
  const { getByTestId } = render();

  fireEvent(getByTestId('FeedItemCommentBox'), 'onCancel');

  expect(onCancel).toHaveBeenCalledWith();
});

it('calls update', async () => {
  const { getByTestId } = renderWithContext(
    <FeedCommentBox
      editingComment={editingComment}
      feedItemId={feedItemId}
      avatarPerson={avatarPerson}
      onAddComplete={onAddComplete}
      onCancel={onCancel}
    />,
    {
      initialState,
    },
  );

  const content = 'test update';
  await fireEvent(getByTestId('FeedItemCommentBox'), 'onSubmit', content);

  expect(useMutation).toHaveBeenMutatedWith(UPDATE_FEED_ITEM_COMMENT_MUTATION, {
    variables: { commentId: editingComment.id, content },
  });
});
