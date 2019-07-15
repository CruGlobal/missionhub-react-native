import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fireEvent } from 'react-native-testing-library';

import {
  renderShallow,
  createMockNavState,
  testSnapshotShallow,
  renderWithContext,
} from '../../../../../testUtils';
import { navigateBack } from '../../../../actions/navigation';
import { lookupOrgCommunityCode } from '../../../../actions/organizations';

import JoinGroupScreen from '..';

jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'back' })),
  navigateReset: jest.fn(() => ({ type: 'reset' })),
}));
jest.mock('../../../../actions/organizations', () => ({
  lookupOrgCommunityCode: jest.fn(() => ({
    type: 'lookup',
    name: 'test',
  })),
  joinCommunity: jest.fn(() => ({
    type: 'join',
    name: 'test',
  })),
}));
jest.mock('../../../../actions/analytics', () => ({
  trackActionWithoutData: jest.fn(() => ({ type: 'track' })),
}));

global.setTimeout = jest.fn();

const mockStore = configureStore([thunk]);
let store = mockStore();

const mockCommunity = {
  id: '123',
  community_code: '123456',
  name: 'Org Name',
  owner: { first_name: 'Owner' },
  contactReport: { memberCount: 2 },
};

const mockNext = jest.fn(() => ({ type: 'nextTest' }));

function buildScreen(props) {
  const component = renderShallow(
    <JoinGroupScreen
      navigation={createMockNavState()}
      {...props}
      next={mockNext}
    />,
    store,
  );
  component.instance().codeInput = { focus: jest.fn() };
  return component;
}

function buildScreenInstance(props) {
  return buildScreen(props).instance();
}

beforeEach(() => {
  store = mockStore();
});

describe('JoinGroupScreen', () => {
  it('renders start correctly', () => {
    testSnapshotShallow(
      <JoinGroupScreen navigation={createMockNavState()} />,
      store,
    );
  });

  it('renders group card correctly', () => {
    const component = buildScreen();
    component.setState({ community: mockCommunity });
    component.update();

    expect(component).toMatchSnapshot();
  });

  it('renders error correctly', () => {
    const component = buildScreen();
    component.setState({ error: 'error message' });
    component.update();

    expect(component).toMatchSnapshot();
  });

  it('mounts and then focuses', () => {
    const instance = buildScreenInstance();
    instance.componentDidMount();

    expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 350);
  });

  describe('onSearch', () => {
    //tests for temporary implementation of onSearch
    //if input has 6 digits, community added to state
    //otherwise, error added to state
    it('should set input without calling serach has < 6 digits', () => {
      const { getByTestId, snapshot } = renderWithContext(
        <JoinGroupScreen next={mockNext} />,
        { store },
      );
      fireEvent.changeText(getByTestId('joinInput'), '123');
      snapshot();
    });

    it('should set community after entering 6th digit', () => {
      const { getByTestId, snapshot } = renderWithContext(
        <JoinGroupScreen next={mockNext} />,
        { store },
      );
      fireEvent.changeText(getByTestId('joinInput'), '123456');
      snapshot();
      expect(lookupOrgCommunityCode).toHaveBeenCalled();
    });
  });

  it('should join community', async () => {
    const component = buildScreen();

    component.setState({ community: mockCommunity });
    component.update();

    await component
      .childAt(1)
      .childAt(0)
      .childAt(0)
      .props()
      .onJoin();

    expect(mockNext).toHaveBeenCalledWith({ community: mockCommunity });
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
