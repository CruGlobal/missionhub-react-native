import React from 'react';
import { Keyboard } from 'react-native';
import MockDate from 'mockdate';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import Input from '../../../components/Input';

import CommentBox from '..';

jest.mock('../../../actions/interactions');

MockDate.set('2017-06-18');
Keyboard.dismiss = jest.fn();

const text = 'test';

let onSubmit: jest.Mock;
let onCancel: jest.Mock;

beforeEach(() => {
  onSubmit = jest.fn();
  onCancel = jest.fn();
});

it('renders with actions, hidden', () => {
  renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderTextKey={'Placeholder'}
      showInteractions={true}
    />,
  ).snapshot();
});

it('renders with actions, shown', () => {
  const { getByTestId, snapshot } = renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderTextKey={'Placeholder'}
      showInteractions={true}
    />,
  );

  fireEvent.press(getByTestId('ActionAddButton'));

  snapshot();
});

it('renders without actions', () => {
  renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderTextKey={'Placeholder'}
    />,
  ).snapshot();
});

it('renders with custom style', () => {
  renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderTextKey={'actions:commentBoxPlaceholder'}
      containerStyle={{ backgroundColor: 'green' }}
    />,
  );
});

it('renders with text entered', () => {
  const { getAllByType, recordSnapshot, diffSnapshot } = renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderTextKey={'actions:commentBoxPlaceholder'}
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
      placeholderTextKey={'actions:commentBoxPlaceholder'}
    />,
  );
  fireEvent(getAllByType(Input)[0], 'onChangeText', text);
  recordSnapshot();

  fireEvent.press(getByTestId('SubmitButton'));

  diffSnapshot();
});

it('handles action press', () => {
  const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderTextKey={'actions:commentBoxPlaceholder'}
      showInteractions={true}
    />,
  );

  recordSnapshot();

  fireEvent.press(getByTestId('ActionAddButton'));

  diffSnapshot();
});

it('handles cancel', () => {
  const { getByTestId } = renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderTextKey={'actions:commentBoxPlaceholder'}
      editingComment={{ id: '1', content: 'test' }}
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
      placeholderTextKey={'actions:commentBoxPlaceholder'}
    />,
  );

  recordSnapshot();

  await flushMicrotasksQueue();

  rerender(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderTextKey={'actions:commentBoxPlaceholder'}
      editingComment={{ id: '1', content: 'test' }}
    />,
  );

  await flushMicrotasksQueue();

  diffSnapshot();
});

it('handles select and clear action', () => {
  const {
    recordSnapshot,
    diffSnapshot,
    getByTestId,
    getAllByTestId,
  } = renderWithContext(
    <CommentBox
      onSubmit={onSubmit}
      onCancel={onCancel}
      placeholderTextKey={'actions:commentBoxPlaceholder'}
      showInteractions={true}
    />,
  );
  fireEvent.press(getByTestId('ActionAddButton'));
  recordSnapshot();

  fireEvent.press(getAllByTestId('ActionButton')[0]);
  diffSnapshot();

  recordSnapshot();
  fireEvent.press(getByTestId('ClearActionButton'));
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
        placeholderTextKey={'actions:commentBoxPlaceholder'}
      />,
    );
    fireEvent(getAllByType(Input)[0], 'onChangeText', text);
    recordSnapshot();

    fireEvent.press(getByTestId('SubmitButton'));
    await flushMicrotasksQueue();

    diffSnapshot();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(null, text);
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
        placeholderTextKey={'actions:commentBoxPlaceholder'}
      />,
    );
    fireEvent(getAllByType(Input)[0], 'onChangeText', text);
    recordSnapshot();

    fireEvent.press(getByTestId('SubmitButton'));
    await flushMicrotasksQueue();

    diffSnapshot();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(null, text);
  });
});
