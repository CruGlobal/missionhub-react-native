import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  renderShallow,
  createMockNavState,
  testSnapshotShallow,
} from '../../../../../testUtils';
import { navigateBack } from '../../../../actions/navigation';
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

beforeEach(() => {
  store = mockStore();
});

describe('DeepLinkConfirmJoinGroupScreen', () => {
  it('renders start correctly', () => {
    testSnapshotShallow(
      // @ts-ignore
      <JoinGroupScreen navigation={createMockNavState()} next={mockNext} />,
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

  it('should join community', async () => {
    // @ts-ignore
    const component = buildScreen();

    component.setState({ community: mockCommunity, errorMessage: '' });
    component.update();

    await component
      .childAt(2)
      .childAt(0)
      .props()
      .onJoin();

    expect(mockNext).toHaveBeenCalledWith({ community: mockCommunity });
  });

  it('should call navigate back', () => {
    // @ts-ignore
    const component = buildScreen();
    const backButton = component.childAt(1).props().left;
    backButton.props.onPress();

    expect(navigateBack).toHaveBeenCalled();
  });
});
