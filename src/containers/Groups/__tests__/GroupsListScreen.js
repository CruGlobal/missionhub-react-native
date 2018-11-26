import React from 'react';
import configureStore from 'redux-mock-store';

import GroupsListScreen from '../GroupsListScreen';
import { renderShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { getMyCommunities } from '../../../actions/organizations';
import { trackAction } from '../../../actions/analytics';
import { communitiesSelector } from '../../../selectors/organizations';
import * as common from '../../../utils/common';
import { GROUP_SCREEN, USER_CREATED_GROUP_SCREEN } from '../GroupScreen';
import { JOIN_GROUP_SCREEN } from '../JoinGroupScreen';
import { CREATE_GROUP_SCREEN } from '../CreateGroupScreen';
import { ACTIONS } from '../../../constants';

jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/analytics');

const mockStore = configureStore();
const organizations = {
  all: [
    {
      id: '1',
      name: 'Test Org 1',
      contactReport: {},
    },
    {
      id: '2',
      name: 'Test Org 2',
      contactReport: {},
      user_created: true,
    },
  ],
};
const auth = {};
const store = mockStore({ organizations, auth });

beforeEach(() => {
  navigatePush.mockReturnValue({ type: 'test' });
  getMyCommunities.mockReturnValue({ type: 'test' });
  trackAction.mockReturnValue({ type: 'test' });
  communitiesSelector.mockReturnValue(organizations.all);
});

it('should render null state', () => {
  const component = renderShallow(
    <GroupsListScreen />,
    mockStore({ organizations: { all: [] }, auth }),
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
        .childAt(2)
        .childAt(0)
        .props()
        .renderItem({ item: organization });
      item.props.onPress(organization);

      expect(navigatePush).toHaveBeenCalledWith(GROUP_SCREEN, { organization });
      expect(communitiesSelector).toHaveBeenCalledWith({
        organizations,
        auth,
      });
      expect(trackAction).toHaveBeenCalledWith(ACTIONS.SELECT_COMMUNITY.name, {
        [ACTIONS.SELECT_COMMUNITY.SELECT]: null,
      });
    });

    it('navigates to user created org screen', () => {
      const organization = organizations.all[1];
      const item = component
        .childAt(2)
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
      expect(trackAction).toHaveBeenCalledWith(ACTIONS.SELECT_COMMUNITY.name, {
        [ACTIONS.SELECT_COMMUNITY.SELECT]: null,
      });
    });
  });

  it('should open main menu', () => {
    common.openMainMenu = jest.fn(() => ({ type: 'test' }));
    const instance = component.instance();
    instance.openMainMenu();
    expect(common.openMainMenu).toHaveBeenCalled();
  });

  it('should call key extractor', () => {
    const instance = component.instance();
    const item = { id: '1' };
    const result = instance.keyExtractor(item);
    expect(result).toEqual(item.id);
  });

  it('should render item', () => {
    const instance = component.instance();
    const renderedItem = instance.renderItem({
      item: { id: '1', name: 'test', contactReport: {} },
    });
    expect(renderedItem).toMatchSnapshot();
  });

  it('should load groups', () => {
    const instance = component.instance();
    instance.loadGroups();
    expect(getMyCommunities).toHaveBeenCalled();
  });

  it('should load groups on mount', () => {
    const instance = component.instance();
    instance.loadGroups = jest.fn();
    instance.componentDidMount();
    expect(instance.loadGroups).toHaveBeenCalled();
  });

  it('should refresh the list', () => {
    const instance = component.instance();
    common.refresh = jest.fn();
    instance.handleRefresh();
    expect(common.refresh).toHaveBeenCalledWith(instance, instance.loadGroups);
  });

  it('should render null', () => {
    const instance = component.instance();
    const renderedItem = instance.renderNull();
    expect(renderedItem).toMatchSnapshot();
  });

  it('navigates to join group screen', () => {
    component
      .childAt(1)
      .childAt(0)
      .childAt(0)
      .props()
      .onPress();

    expect(navigatePush).toHaveBeenCalledWith(JOIN_GROUP_SCREEN);
  });

  it('navigates to create group screen', () => {
    component
      .childAt(1)
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();

    expect(navigatePush).toHaveBeenCalledWith(CREATE_GROUP_SCREEN);
  });
});
