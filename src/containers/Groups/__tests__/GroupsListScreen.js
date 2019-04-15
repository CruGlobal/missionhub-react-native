import React from 'react';
import configureStore from 'redux-mock-store';

import GroupsListScreen from '../GroupsListScreen';
import { renderShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { getMyCommunities } from '../../../actions/organizations';
import { trackActionWithoutData } from '../../../actions/analytics';
import { communitiesSelector } from '../../../selectors/organizations';
import * as common from '../../../utils/common';
import { GROUP_SCREEN, USER_CREATED_GROUP_SCREEN } from '../GroupScreen';
import { CREATE_GROUP_SCREEN } from '../CreateGroupScreen';
import { checkForUnreadComments } from '../../../actions/unreadComments';
import { resetScrollGroups } from '../../../actions/swipe';
import { ACTIONS } from '../../../constants';
import {
  CREATE_COMMUNITY_UNAUTHENTICATED_FLOW,
  JOIN_BY_CODE_FLOW,
} from '../../../routes/constants';

jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/unreadComments');
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../actions/organizations', () => ({
  getMyCommunities: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../actions/swipe', () => ({
  resetScrollGroups: jest.fn(() => ({ type: 'reset' })),
}));
jest.mock('../../../actions/analytics');
jest.mock('../../TrackTabChange', () => () => null);

const mockStore = configureStore();
const organizations = {
  all: [
    {
      id: '1',
      name: 'Test Org 1',
    },
    {
      id: '2',
      name: 'Test Org 2',
      user_created: true,
    },
  ],
};
const auth = { isFirstTime: false };
const swipe = {};
const store = mockStore({ organizations, auth, swipe });

beforeEach(() => {
  navigatePush.mockReturnValue({ type: 'test' });
  getMyCommunities.mockReturnValue({ type: 'test' });
  trackActionWithoutData.mockReturnValue({ type: 'test' });
  communitiesSelector.mockReturnValue(organizations.all);
  checkForUnreadComments.mockReturnValue({
    type: 'check for unread comments',
  });
  common.refresh = jest.fn((_, refreshMethod) => refreshMethod());
});

it('should render null state', () => {
  const component = renderShallow(
    <GroupsListScreen />,
    mockStore({ organizations: { all: [] }, auth, swipe }),
  );
  expect(component).toMatchSnapshot();
});

describe('GroupsListScreen', () => {
  let component;
  beforeEach(() => {
    component = renderShallow(<GroupsListScreen />, store);
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });

  describe('handlePress', () => {
    it('navigates to groups screen', () => {
      const organization = organizations.all[0];
      const item = component
        .childAt(3)
        .childAt(0)
        .props()
        .renderItem({ item: organization });
      item.props.onPress(organization);

      expect(navigatePush).toHaveBeenCalledWith(GROUP_SCREEN, { organization });
      expect(communitiesSelector).toHaveBeenCalledWith({
        organizations,
        auth,
      });
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.SELECT_COMMUNITY,
      );
    });

    it('navigates to user created org screen', () => {
      const organization = organizations.all[1];
      const item = component
        .childAt(3)
        .childAt(0)
        .props()
        .renderItem({ item: organization });
      item.props.onPress(organization);

      expect(navigatePush).toHaveBeenCalledWith(USER_CREATED_GROUP_SCREEN, {
        organization,
      });
      expect(communitiesSelector).toHaveBeenCalledWith({
        organizations,
        auth,
      });
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.SELECT_COMMUNITY,
      );
    });
  });

  it('should open main menu', () => {
    common.openMainMenu = jest.fn(() => ({ type: 'test' }));
    const instance = component.instance();
    instance.openMainMenu();
    expect(common.openMainMenu).toHaveBeenCalled();
  });

  it('should render item', () => {
    const instance = component.instance();
    const renderedItem = instance.renderItem({
      item: { id: '1', name: 'test' },
    });
    expect(renderedItem).toMatchSnapshot();
  });

  it('should load groups', () => {
    const instance = component.instance();
    instance.loadGroups();
    expect(getMyCommunities).toHaveBeenCalled();
  });

  it('should load groups on mount', async () => {
    const instance = component.instance();
    instance.loadGroups = jest.fn();
    await instance.componentDidMount();
    expect(instance.loadGroups).toHaveBeenCalled();
  });

  it('should load groups and scroll to index 0', async () => {
    const store = mockStore({
      organizations,
      auth,
      swipe: { groupScrollToId: '1' },
    });
    component = renderShallow(<GroupsListScreen />, store);
    const instance = component.instance();
    instance.flatList = { scrollToIndex: jest.fn() };
    instance.loadGroups = jest.fn();
    await instance.componentDidMount();
    expect(instance.loadGroups).toHaveBeenCalled();
    expect(resetScrollGroups).toHaveBeenCalled();
    expect(instance.flatList.scrollToIndex).toHaveBeenCalledWith({
      animated: true,
      index: 0,
      viewPosition: 0,
    });
  });

  it('should load groups and scroll to index 1', async () => {
    const store = mockStore({
      organizations,
      auth,
      swipe: { groupScrollToId: '2' },
    });
    component = renderShallow(<GroupsListScreen />, store);
    const instance = component.instance();
    instance.flatList = { scrollToIndex: jest.fn() };
    instance.loadGroups = jest.fn();
    await instance.componentDidMount();
    expect(instance.loadGroups).toHaveBeenCalled();
    expect(resetScrollGroups).toHaveBeenCalled();
    expect(instance.flatList.scrollToIndex).toHaveBeenCalledWith({
      animated: true,
      index: 1,
      viewPosition: 0.5,
    });
  });

  it('should load groups and not scroll to index', async () => {
    const store = mockStore({
      organizations,
      auth,
      swipe: { groupScrollToId: 'doesnt exist' },
    });
    component = renderShallow(<GroupsListScreen />, store);
    const instance = component.instance();
    instance.flatList = { scrollToIndex: jest.fn() };
    instance.loadGroups = jest.fn();
    await instance.componentDidMount();
    expect(instance.loadGroups).toHaveBeenCalled();
    expect(instance.flatList.scrollToIndex).toHaveBeenCalledTimes(0);
    expect(resetScrollGroups).toHaveBeenCalled();
  });

  it('should refresh the list', () => {
    const instance = component.instance();

    instance.handleRefresh();

    expect(checkForUnreadComments).toHaveBeenCalled();
    expect(common.refresh).toHaveBeenCalledWith(instance, instance.loadGroups);
    expect(getMyCommunities).toHaveBeenCalled();
  });

  it('should render null', () => {
    const instance = component.instance();
    const renderedItem = instance.renderNull();
    expect(renderedItem).toMatchSnapshot();
  });

  it('navigates to join group screen', () => {
    component
      .childAt(2)
      .childAt(0)
      .childAt(0)
      .props()
      .onPress();

    expect(navigatePush).toHaveBeenCalledWith(JOIN_BY_CODE_FLOW);
  });

  it('navigates to create group screen', () => {
    component
      .childAt(2)
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();

    expect(navigatePush).toHaveBeenCalledWith(CREATE_GROUP_SCREEN);
  });

  it('navigates to Upgrade Account Screen if not signed in', () => {
    const store = mockStore({
      organizations,
      auth: { isFirstTime: true },
      swipe,
    });

    component = renderShallow(<GroupsListScreen />, store);

    component
      .childAt(2)
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();

    expect(navigatePush).toHaveBeenCalledWith(
      CREATE_COMMUNITY_UNAUTHENTICATED_FLOW,
    );
  });
});
