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
  owner: { first_name: 'Owner', last_name: 'Ofthisgroup' },
  contactReport: { memberCount: 2 },
  user_created: false,
  unread_comments_count: 0,
  community_photo_url: 'www.missionhub.com',
};

const mockNext = jest.fn(() => ({ type: 'nextTest' }));

// @ts-ignore
function buildScreen(props) {
  const component = renderShallow(
    <JoinGroupScreen
      navigation={createMockNavState()}
      {...props}
      next={mockNext}
    />,
    store,
  );
  // @ts-ignore
  component.instance().codeInput = { focus: jest.fn() };
  return component;
}

// @ts-ignore
function buildScreenInstance(props) {
  return buildScreen(props).instance();
}

beforeEach(() => {
  store = mockStore();
});

describe('JoinGroupScreen', () => {
  it('renders start correctly', () => {
    testSnapshotShallow(
      // @ts-ignore
      <JoinGroupScreen navigation={createMockNavState()} />,
      store,
    );
  });

  it('renders group card correctly', () => {
    // @ts-ignore
    const component = buildScreen();
    component.setState({ community: mockCommunity });
    component.update();

    expect(component).toMatchSnapshot();
  });

  it('renders error correctly', () => {
    // @ts-ignore
    const component = buildScreen();
    component.setState({ error: 'error message' });
    component.update();

    expect(component).toMatchSnapshot();
  });

  it('mounts and then focuses', () => {
    // @ts-ignore
    const instance = buildScreenInstance();
    // @ts-ignore
    instance.componentDidMount();

    expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 350);
  });

  describe('onSearch', () => {
    //tests for temporary implementation of onSearch
    //if input has 6 digits, community added to state
    //otherwise, error added to state
    it('should set input without calling serach has < 6 digits', () => {
      const { getByTestId, snapshot } = renderWithContext(
        // @ts-ignore
        <JoinGroupScreen next={mockNext} />,
        { store },
      );
      fireEvent.changeText(getByTestId('joinInput'), '123');
      snapshot();
    });

    it('should set community after entering 6th digit', () => {
      const { getByTestId, snapshot } = renderWithContext(
        // @ts-ignore
        <JoinGroupScreen next={mockNext} />,
        { store },
      );
      fireEvent.changeText(getByTestId('joinInput'), '123456');
      snapshot();
      expect(lookupOrgCommunityCode).toHaveBeenCalled();
    });
  });

  it('should join community', async () => {
    // @ts-ignore
    const component = buildScreen();

    component.setState({ community: mockCommunity });
    component.update();

    await component
      .childAt(2)
      .childAt(0)
      .childAt(0)
      .props()
      .onJoin();

    expect(mockNext).toHaveBeenCalledWith({ community: mockCommunity });
  });

  it('should call ref', () => {
    // @ts-ignore
    const instance = buildScreenInstance();
    const ref = 'test';
    // @ts-ignore
    instance.ref(ref);
    // @ts-ignore
    expect(instance.codeInput).toEqual(ref);
  });
});
