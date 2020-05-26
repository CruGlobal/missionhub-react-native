import React from 'react';
import { Keyboard } from 'react-native';
import MockDate from 'mockdate';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import Input from '../../../components/Input';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { FeedItemEditingComment } from '../../../containers/Communities/Community/CommunityFeed/FeedItemDetailScreen/FeedCommentBox/__generated__/FeedItemEditingComment';
import { FEED_ITEM_EDITING_COMMENT_FRAGMENT } from '../../../containers/Communities/Community/CommunityFeed/FeedItemDetailScreen/FeedCommentBox/queries';

import CommentBox from '..';

jest.mock('../../../actions/interactions');

MockDate.set('2017-06-18');
Keyboard.dismiss = jest.fn();

const text = 'test';

let onSubmit: jest.Mock;
let onCancel: jest.Mock;
const editingComment = mockFragment<FeedItemEditingComment>(
  FEED_ITEM_EDITING_COMMENT_FRAGMENT,
);

beforeEach(() => {
  onSubmit = jest.fn();
  onCancel = jest.fn();
});

it('renders without actions', () => {
  renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderText={'Placeholder'}
    />,
  ).snapshot();
});

it('renders with text entered', () => {
  const { getAllByType, recordSnapshot, diffSnapshot } = renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderText={'Placeholder'}
    />,
  );

  recordSnapshot();

  fireEvent(getAllByType(Input)[0], 'onChangeText', text);

  diffSnapshot();
});

it('renders with disabled submit button', () => {
  const {
    getAllByType,
    getByTestId,
    recordSnapshot,
    diffSnapshot,
  } = renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderText={'Placeholder'}
    />,
  );
  fireEvent(getAllByType(Input)[0], 'onChangeText', text);
  recordSnapshot();

  fireEvent.press(getByTestId('SubmitButton'));

  diffSnapshot();
});

it('handles cancel', () => {
  const { getByTestId } = renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderText={'Placeholder'}
      editingComment={editingComment}
    />,
  );

  fireEvent.press(getByTestId('CancelButton'));

  expect(onCancel).toHaveBeenCalled();
  expect(Keyboard.dismiss).toHaveBeenCalled();
});

it('handles start edit', async () => {
  const { recordSnapshot, diffSnapshot, rerender } = renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderText={'Placeholder'}
    />,
  );

  recordSnapshot();

  await flushMicrotasksQueue();

  rerender(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderText={'Placeholder'}
      editingComment={editingComment}
    />,
  );

  await flushMicrotasksQueue();

  diffSnapshot();
});

describe('click submit button', () => {
  it('calls onSubmit prop', async () => {
    const {
      getAllByType,
      getByTestId,
      recordSnapshot,
      diffSnapshot,
    } = renderWithContext(
      <CommentBox
        onSubmit={onSubmit}
        onCancel={onCancel}
        placeholderText={'Placeholder'}
      />,
    );
    fireEvent(getAllByType(Input)[0], 'onChangeText', text);
    recordSnapshot();

    fireEvent.press(getByTestId('SubmitButton'));
    await flushMicrotasksQueue();

    diffSnapshot();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(text);
  });

  it('calls onSubmit prop fails', async () => {
    const onSubmit = jest.fn(() => Promise.reject());

    const {
      getAllByType,
      getByTestId,
      recordSnapshot,
      diffSnapshot,
    } = renderWithContext(
      <CommentBox
        onSubmit={onSubmit}
        onCancel={onCancel}
        placeholderText={'Placeholder'}
      />,
    );
    fireEvent(getAllByType(Input)[0], 'onChangeText', text);
    recordSnapshot();

    fireEvent.press(getByTestId('SubmitButton'));
    await flushMicrotasksQueue();

    diffSnapshot();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(text);
  });
});
