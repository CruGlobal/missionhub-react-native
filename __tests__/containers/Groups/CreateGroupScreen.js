import React from 'react';
import { Keyboard } from 'react-native';
import configureStore from 'redux-mock-store';

import CreateGroupScreen from '../../../src/containers/Groups/CreateGroupScreen';
import {
  renderShallow,
  createMockNavState,
  testSnapshotShallow,
} from '../../../testUtils';
import { navigateBack } from '../../../src/actions/navigation';

jest.mock('../../../src/actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'test' })),
}));

const mockStore = configureStore();
const store = mockStore();

function buildScreen(props) {
  return renderShallow(
    <CreateGroupScreen navigation={createMockNavState()} {...props} />,
    store,
  );
}

function buildScreenInstance(props) {
  return buildScreen(props).instance();
}

describe('CreateGroupScreen', () => {
  it('renders correctly', () => {
    testSnapshotShallow(
      <CreateGroupScreen navigation={createMockNavState()} />,
      store,
    );
  });

  it('should update the state', () => {
    const component = buildScreenInstance();

    const name = 'test';
    component.onChangeText(name);

    expect(component.state.name).toEqual(name);
  });

  it('should update the image', () => {
    const component = buildScreenInstance();

    const uri = 'testuri';
    component.handleImageChange({ uri });

    expect(component.state.imageUri).toEqual(uri);
    expect(component).toMatchSnapshot();
  });

  it('should call create community', () => {
    Keyboard.dismiss = jest.fn();
    const component = buildScreen();
    component
      .childAt(2)
      .childAt(0)
      .props()
      .onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    // TODO: Expect more to happen when the API call is implemented
  });

  it('should call navigate back', () => {
    const component = buildScreen();
    const backButton = component.childAt(0).props().left;
    backButton.props.onPress();

    expect(navigateBack).toHaveBeenCalled();
  });

  it('should call ref', () => {
    const instance = buildScreenInstance();
    const ref = 'test';
    instance.ref(ref);
    expect(instance.nameInput).toEqual(ref);
  });
});
