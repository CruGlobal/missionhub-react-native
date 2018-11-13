import React from 'react';
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

describe('JoinGroupScreen', () => {
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

  describe('onSearch', () => {
    //tests for temporary implementation of onSearch
    //if input has 6 digits, community added to state
    //otherwise, error added to state
    it('should set error if input has < 6 digits', () => {
      const component = buildScreen();

      component.instance().codeInput = { focus: jest.fn() };

      component
        .find('Input')
        .props()
        .onChangeText('123');

      component
        .childAt(2)
        .childAt(0)
        .props()
        .onPress();

      expect(component.instance().state).toMatchSnapshot();
    });

    it('should set community if input has 6 digits', () => {
      const component = buildScreen();

      component.instance().codeInput = { focus: jest.fn() };

      component
        .find('Input')
        .props()
        .onChangeText('123456');

      component
        .childAt(2)
        .childAt(0)
        .props()
        .onPress();

      expect(component.instance().state).toMatchSnapshot();
    });

    it('should set community after entering 6th digit', async () => {
      const component = buildScreen();

      component.instance().codeInput = { focus: jest.fn() };

      await component
        .find('Input')
        .props()
        .onChangeText('123456');

      expect(component.instance().state).toMatchSnapshot();
    });
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
