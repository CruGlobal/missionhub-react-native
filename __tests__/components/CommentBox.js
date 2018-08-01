import React from 'react';
import MockDate from 'mockdate';

import { renderShallow, testSnapshotShallow } from '../../testUtils';
import CommentBox from '../../src/components/CommentBox';

MockDate.set('2017-06-18');

const action = {
  id: 2,
  iconName: 'spiritualConversationIcon',
  translationKey: 'interactionSpiritualConversation',
  isOnAction: true,
};

it('renders with actions', () => {
  testSnapshotShallow(<CommentBox onSubmit={jest.fn()} />);
});

it('renders without actions', () => {
  testSnapshotShallow(<CommentBox onSubmit={jest.fn()} hideActions={true} />);
});

it('handles text changes', () => {
  const text = 'test';
  const instance = renderShallow(
    <CommentBox onSubmit={jest.fn()} />,
  ).instance();
  instance.handleTextChange(text);

  expect(instance.state.text).toEqual(text);
});

it('handles action press', () => {
  const instance = renderShallow(
    <CommentBox onSubmit={jest.fn()} />,
  ).instance();
  instance.handleActionPress();

  expect(instance.state.showActions).toEqual(true);
});

it('handles focus', () => {
  const instance = renderShallow(
    <CommentBox onSubmit={jest.fn()} />,
  ).instance();
  instance.focus();

  expect(instance.state.isFocused).toEqual(true);
});

it('handles blur', () => {
  const instance = renderShallow(
    <CommentBox onSubmit={jest.fn()} />,
  ).instance();
  instance.blur();

  expect(instance.state.isFocused).toEqual(false);
});

it('handles select and clear action', () => {
  const instance = renderShallow(
    <CommentBox onSubmit={jest.fn()} />,
  ).instance();
  instance.selectAction(action);

  expect(instance.state.action).toEqual(action);

  instance.clearAction();
  expect(instance.state.action).toEqual(null);
});

it('renders with text', () => {
  const component = renderShallow(<CommentBox onSubmit={jest.fn()} />).setState(
    { text: 'test' },
  );
  expect(component).toMatchSnapshot();
});

it('renders focused', () => {
  const component = renderShallow(<CommentBox onSubmit={jest.fn()} />).setState(
    { isFocused: true },
  );
  expect(component).toMatchSnapshot();
});

it('renders with actions', () => {
  const component = renderShallow(<CommentBox onSubmit={jest.fn()} />).setState(
    { showActions: true },
  );
  expect(component).toMatchSnapshot();
});

it('renders with actions and selected action', () => {
  const component = renderShallow(<CommentBox onSubmit={jest.fn()} />).setState(
    { showActions: true, action },
  );
  expect(component).toMatchSnapshot();
});

it('renders without actions and selected action', () => {
  const component = renderShallow(<CommentBox onSubmit={jest.fn()} />).setState(
    { showActions: false, action },
  );
  expect(component).toMatchSnapshot();
});
