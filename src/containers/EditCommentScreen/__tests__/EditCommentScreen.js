import { Keyboard } from 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import EditCommentScreen from '..';

import { renderShallow, createMockNavState } from '../../../../testUtils';
import { updateCelebrateComment } from '../../../actions/celebrateComments';
import { navigateBack } from '../../../actions/navigation';
import { celebrateCommentsCommentSelector } from '../../../selectors/celebrateComments';

jest.mock('../../../actions/celebrateComments');
jest.mock('../../../selectors/celebrateComments');
jest.mock('../../../actions/navigation');

const mockStore = configureStore([thunk]);
let store;

const updateCelebrateCommentResult = { type: 'loaded comments' };
const navigateBackResult = { type: 'navigate back' };

let component;

updateCelebrateComment.mockReturnValue(dispatch =>
  dispatch(updateCelebrateCommentResult),
);
navigateBack.mockReturnValue(dispatch => dispatch(navigateBackResult));
Keyboard.dismiss = jest.fn();

const event = { id: 'celebrate1' };
const comment = {
  id: 'comment1',
  content: 'comment text',
  organization_celebration_item: event,
};
const celebrateComments = {
  comments: [comment, { content: 'another comment' }],
  pagination: {},
};
const celebrateCommentsState = {
  all: { [event.id]: { ...event, comments: celebrateComments } },
};
celebrateCommentsCommentSelector.mockReturnValue(comment);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({
    celebrateComments: celebrateCommentsState,
  });

  component = renderShallow(
    <EditCommentScreen
      navigation={createMockNavState({
        item: comment,
      })}
    />,
    store,
  );
});

it('renders correctly', () => {
  expect(component).toMatchSnapshot();
});

it('should call ref', () => {
  const instance = component.instance();
  const ref = 'test';
  instance.inputRef(ref);
  expect(instance.input).toEqual(ref);
});

it('should call focus', () => {
  const instance = component.instance();
  const inputFocus = jest.fn();
  instance.input = { focus: inputFocus };
  component
    .childAt(2)
    .childAt(0)
    .props()
    .onPress();
  expect(inputFocus).toHaveBeenCalled();
});

it('should call close', () => {
  component
    .childAt(1)
    .props()
    .left.props.customNavigate();
  expect(navigateBack).toHaveBeenCalled();
});

it('should update text', () => {
  const updated = 'updated text';
  component
    .childAt(2)
    .childAt(0)
    .childAt(0)
    .props()
    .onChangeText(updated);
  component.update();
  expect(component.instance().state.text).toEqual(updated);
});

it('should save note', async () => {
  const updated = 'updated text';
  component
    .childAt(2)
    .childAt(0)
    .childAt(0)
    .props()
    .onChangeText(updated);
  component.update();
  await component
    .childAt(2)
    .childAt(1)
    .childAt(0)
    .props()
    .onPress();

  expect(Keyboard.dismiss).toHaveBeenCalled();
  expect(updateCelebrateComment).toHaveBeenCalledWith(comment, updated);
  expect(navigateBack).toHaveBeenCalled();
});
