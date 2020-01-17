import React from 'react';
import { Keyboard } from 'react-native';
import MockDate from 'mockdate';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import { addNewInteraction } from '../../../actions/interactions';

import CommentBox from '..';

jest.mock('../../../actions/interactions');

MockDate.set('2017-06-18');
Keyboard.dismiss = jest.fn();

const mockStore = configureStore([thunk]);
let store;

const props = {
  person: { id: '1' },
  onSubmit: jest.fn(),
  placeholderTextKey: 'actions:commentBoxPlaceholder',
  onCancel: jest.fn(),
};

const action = {
  id: 2,
  iconName: 'spiritualConversationIcon',
  translationKey: 'interactionSpiritualConversation',
  isOnAction: true,
};
const addNewInteractionResult = { type: 'added interaction' };
const initialState = {
  text: '',
  showActions: false,
  action: null,
  isSubmitting: false,
};

beforeEach(() => {
  store = mockStore();
  addNewInteraction.mockReturnValue(addNewInteractionResult);
});

it('renders with actions', () => {
  testSnapshotShallow(<CommentBox {...props} />);
});

it('renders without actions', () => {
  testSnapshotShallow(<CommentBox {...props} hideActions={true} />);
});

it('renders with custom style', () => {
  testSnapshotShallow(
    <CommentBox {...props} containerStyle={{ backgroundColor: 'green' }} />,
  );
});

it('renders with text entered', () => {
  const component = renderShallow(<CommentBox {...props} />);
  component.setState({ text: 'test' });
  component.update();
  expect(component).toMatchSnapshot();
});

it('renders with disabled submit button', () => {
  const component = renderShallow(<CommentBox {...props} />);
  component.setState({ text: 'test', isSubmitting: true });
  component.update();

  expect(component).toMatchSnapshot();
});

it('handles text changes', () => {
  const text = 'test';
  const instance = renderShallow(<CommentBox {...props} />).instance();
  instance.handleTextChange(text);

  expect(instance.state.text).toEqual(text);
});

it('handles action press', () => {
  const instance = renderShallow(<CommentBox {...props} />).instance();
  instance.handleActionPress();

  expect(instance.state.showActions).toEqual(true);
});

it('handles cancel', () => {
  const instance = renderShallow(<CommentBox {...props} />).instance();
  instance.cancel();

  expect(instance.state).toEqual(initialState);
  expect(props.onCancel).toHaveBeenCalled();
  expect(Keyboard.dismiss).toHaveBeenCalled();
});

it('handles start edit', () => {
  const instance = renderShallow(<CommentBox {...props} />).instance();
  const comment = { content: 'test' };
  const focus = jest.fn();
  instance.commentInput = { focus };
  instance.startEdit(comment);

  expect(instance.state.text).toEqual(comment.content);
  expect(focus).toHaveBeenCalled();
});

it('handles select and clear action', () => {
  const instance = renderShallow(<CommentBox {...props} />).instance();
  instance.selectAction(action);

  expect(instance.state.action).toEqual(action);

  instance.clearAction();
  expect(instance.state.action).toEqual(null);
});

it('renders with text', () => {
  const component = renderShallow(<CommentBox {...props} />).setState({
    text: 'test',
  });
  expect(component).toMatchSnapshot();
});

it('renders with actions', () => {
  const component = renderShallow(<CommentBox {...props} />).setState({
    showActions: true,
  });
  expect(component).toMatchSnapshot();
});

it('renders with actions and selected action', () => {
  const component = renderShallow(<CommentBox {...props} />).setState({
    showActions: true,
    action,
  });
  expect(component).toMatchSnapshot();
});

it('renders without actions and selected action', () => {
  const component = renderShallow(<CommentBox {...props} />).setState({
    showActions: false,
    action,
  });
  expect(component).toMatchSnapshot();
});

it('componentDidUpdate', () => {
  const shallowScreen = renderShallow(<CommentBox {...props} />);
  jest.spyOn(shallowScreen.instance(), 'startEdit');
  shallowScreen.instance().commentInput = { focus: jest.fn() };

  const comment = { id: 'editing' };
  shallowScreen.setProps({ editingComment: comment });
  shallowScreen.instance().componentDidUpdate({ editingComment: null });

  expect(shallowScreen.instance().startEdit).toHaveBeenCalledWith(comment);
});

it('componentDidMount', () => {
  const comment = { id: 'editing' };
  const shallowScreen = renderShallow(<CommentBox {...props} />);
  jest.spyOn(shallowScreen.instance(), 'startEdit');
  shallowScreen.instance().commentInput = { focus: jest.fn() };
  shallowScreen.setProps({ editingComment: comment });

  shallowScreen.instance().componentDidMount();

  expect(shallowScreen.instance().startEdit).toHaveBeenCalledWith(comment);
});

describe('click submit button', () => {
  const person = { id: '1' };
  const organization = { id: '100' };
  const text = 'roge rules';
  let component;

  const setText = text => {
    component
      .childAt(0)
      .childAt(0)
      .childAt(1)
      .childAt(0)
      .childAt(0)
      .props()
      .onChangeText(text);
    component.update();
  };

  const clickSubmit = () =>
    component
      .childAt(0)
      .childAt(0)
      .childAt(1)
      .childAt(0)
      .childAt(1)
      .props()
      .onPress();

  it('calls onSubmit prop', async () => {
    const onSubmit = jest.fn();
    component = renderShallow(
      <CommentBox
        {...props}
        person={person}
        organization={organization}
        onSubmit={onSubmit}
      />,
      store,
    );
    setText(text);

    await clickSubmit();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(null, text);
    expect(component.instance().state).toEqual(initialState);
  });

  it('calls onSubmit prop fails', async () => {
    const onSubmit = jest.fn(() => Promise.reject());
    component = renderShallow(
      <CommentBox
        {...props}
        person={person}
        organization={organization}
        onSubmit={onSubmit}
      />,
      store,
    );
    setText(text);

    await clickSubmit();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(null, text);
    expect(component.instance().state).toEqual({ ...initialState, text });
  });
});
