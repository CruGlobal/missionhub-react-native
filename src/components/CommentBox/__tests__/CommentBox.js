import React from 'react';
import MockDate from 'mockdate';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';

import CommentBox from '..';

import { addNewInteraction } from '../../../actions/interactions';
import { INTERACTION_TYPES } from '../../../constants';

jest.mock('../../../actions/interactions');

MockDate.set('2017-06-18');

const mockStore = configureStore([thunk]);
let store;

const props = {
  person: { id: '1' },
  onSubmit: jest.fn(),
};

const action = {
  id: 2,
  iconName: 'spiritualConversationIcon',
  translationKey: 'interactionSpiritualConversation',
  isOnAction: true,
};
const addNewInteractionResult = { type: 'added interaction' };

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

it('handles focus', () => {
  const instance = renderShallow(<CommentBox {...props} />).instance();
  instance.focus();

  expect(instance.state.isFocused).toEqual(true);
});

it('handles blur', () => {
  const instance = renderShallow(<CommentBox {...props} />).instance();
  instance.blur();

  expect(instance.state.isFocused).toEqual(false);
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

it('renders focused', () => {
  const component = renderShallow(<CommentBox {...props} />).setState({
    isFocused: true,
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

describe('click submit button', () => {
  const person = { id: '1' };
  const organization = { id: '100' };
  const text = 'roge rules';
  let component;

  const setText = text => {
    component
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
      .childAt(1)
      .childAt(0)
      .childAt(1)
      .props()
      .onPress();

  describe('with no interaction selected', () => {
    it('should add a comment', async () => {
      component = renderShallow(
        <CommentBox person={person} organization={organization} />,
        store,
      );
      setText(text);

      await clickSubmit();

      expect(addNewInteraction).toHaveBeenCalledWith(
        person.id,
        INTERACTION_TYPES.MHInteractionTypeNote,
        text,
        organization.id,
      );
      expect(store.getActions()).toEqual([addNewInteractionResult]);
    });
  });

  it('calls onSubmit prop', async () => {
    const onSubmit = jest.fn();
    component = renderShallow(
      <CommentBox
        person={person}
        organization={organization}
        onSubmit={onSubmit}
      />,
      store,
    );
    setText(text);

    await clickSubmit();

    expect(onSubmit).toHaveBeenCalled();
  });
});
