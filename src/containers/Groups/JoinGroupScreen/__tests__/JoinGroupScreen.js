import React from 'react';
import { Keyboard } from 'react-native';
import configureStore from 'redux-mock-store';

import JoinGroupScreen from '..';

import {
  renderShallow,
  createMockNavState,
  testSnapshotShallow,
} from '../../../../../testUtils';
import { navigateBack } from '../../../../actions/navigation';

jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'test' })),
}));

const mockStore = configureStore();
const store = mockStore();

function buildScreen(props) {
  return renderShallow(
    <JoinGroupScreen navigation={createMockNavState()} {...props} />,
    store,
  );
}

function buildScreenInstance(props) {
  return buildScreen(props).instance();
}

describe('CreateGroupScreen', () => {
  it('renders start correctly', () => {
    testSnapshotShallow(
      <JoinGroupScreen navigation={createMockNavState()} />,
      store,
    );
  });

  it('renders group card correctly', () => {
    const component = buildScreen();
    component.setState({ community: { id: '1' } });
    component.update();

    expect(component).toMatchSnapshot();
  });

  it('renders error correctly', () => {
    const component = buildScreen();
    component.setState({ error: 'error message' });
    component.update();

    expect(component).toMatchSnapshot();
  });

  it('should call onSearch', () => {
    Keyboard.dismiss = jest.fn();
    const component = buildScreen();
    component
      .childAt(2)
      .childAt(0)
      .props()
      .onPress();

    expect(component.instance().onSearch).toHaveBeenCalled();
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
    expect(instance.codeInput).toEqual(ref);
  });
});
