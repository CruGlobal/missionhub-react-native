import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import JoinGroupScreen from '..';

import {
  renderShallow,
  createMockNavState,
  testSnapshotShallow,
} from '../../../../../testUtils';
import { navigateBack } from '../../../../actions/navigation';
import { ACTIONS, ERROR_PERSON_PART_OF_ORG } from '../../../../constants';
import {
  lookupOrgCommunityCode,
  joinCommunity,
} from '../../../../actions/organizations';
import { trackActionWithoutData } from '../../../../actions/analytics';

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
  return renderShallow(
    <JoinGroupScreen
      navigation={createMockNavState()}
      {...props}
      next={mockNext}
    />,
    store,
  );
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

  describe('onSearch', () => {
    //tests for temporary implementation of onSearch
    //if input has 6 digits, community added to state
    //otherwise, error added to state
    it('should set error if input has < 6 digits', async () => {
      const component = buildScreen();

      component.instance().codeInput = { focus: jest.fn() };

      await component
        .find('Input')
        .props()
        .onChangeText('123');

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

    expect(joinCommunity).toHaveBeenCalledWith(
      mockCommunity.id,
      mockCommunity.community_code,
    );
    expect(mockNext).toHaveBeenCalled();
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_JOINED_COMMUNITY,
    );
  });

  it('should join community with error code already present', async () => {
    const component = buildScreen();
    const instance = component.instance();

    instance.joined = jest.fn();

    component.setState({ community: mockCommunity });
    component.update();

    joinCommunity.mockImplementation(() => {
      return async () =>
        await Promise.reject({
          apiError: { errors: [{ detail: ERROR_PERSON_PART_OF_ORG }] },
        });
    });

    await component
      .childAt(1)
      .childAt(0)
      .childAt(0)
      .props()
      .onJoin();

    expect(joinCommunity).toHaveBeenCalledWith(
      mockCommunity.id,
      mockCommunity.community_code,
    );
    expect(instance.joined).toHaveBeenCalled();
  });

  it('should join community with error code unknown error', async () => {
    const component = buildScreen();
    const instance = component.instance();

    instance.joined = jest.fn();

    component.setState({ community: mockCommunity });
    component.update();

    const someError = {
      apiError: { errors: [{ detail: 'some error' }] },
    };
    joinCommunity.mockImplementation(() => {
      return async () => await Promise.reject(someError);
    });

    try {
      await component
        .childAt(1)
        .childAt(0)
        .childAt(0)
        .props()
        .onJoin();
    } catch (e) {
      expect(e).toEqual(someError);
    }
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
