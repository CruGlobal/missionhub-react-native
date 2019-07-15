import React from 'react';
import configureStore from 'redux-mock-store';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import GroupsListScreen from '../GroupsListScreen';
import { renderShallow, renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import {
  getMyCommunities,
  navigateToOrg,
} from '../../../actions/organizations';
import { trackActionWithoutData } from '../../../actions/analytics';
import { communitiesSelector } from '../../../selectors/organizations';
import * as common from '../../../utils/common';
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
jest.mock('../../../actions/organizations');
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
const initialState = { organizations, auth, swipe };
const store = mockStore(initialState);

beforeEach(() => {
  navigatePush.mockReturnValue({ type: 'test' });
  getMyCommunities.mockReturnValue({ type: 'test' });
  navigateToOrg.mockReturnValue({ type: 'test' });
  trackActionWithoutData.mockReturnValue({ type: 'test' });
  communitiesSelector.mockReturnValue(organizations.all);
  checkForUnreadComments.mockReturnValue({
    type: 'check for unread comments',
  });
  common.refresh = jest.fn((_, refreshMethod) => refreshMethod());
  common.openMainMenu = jest.fn(() => ({ type: 'open main menu' }));
});

it('should render null state', () => {
  renderWithContext(<GroupsListScreen />, {
    initialState: { organizations: { all: [] }, auth, swipe },
  }).snapshot();
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

      expect(navigateToOrg).toHaveBeenCalledWith(organization.id);
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.SELECT_COMMUNITY,
      );
    });
  });

  it('should open main menu', () => {
    const { getByTestId } = renderWithContext(<GroupsListScreen />, {
      initialState,
    });
    expect(getMyCommunities).toHaveBeenCalled();
    fireEvent.press(getByTestId('IconButton'));
    expect(common.openMainMenu).toHaveBeenCalled();
  });

  it('should load groups on mount', () => {
    renderWithContext(<GroupsListScreen />, { store });
    expect(getMyCommunities).toHaveBeenCalled();
  });

  it('should load groups and scroll to index 0', async () => {
    renderWithContext(<GroupsListScreen />, {
      initialState: { ...initialState, swipe: { groupScrollToId: '1' } },
    });
    await flushMicrotasksQueue();
    expect(getMyCommunities).toHaveBeenCalled();
    // TODO: Not sure how to test ref
    // expect(flatList.scrollToIndex).toHaveBeenCalledWith({
    //   animated: true,
    //   index: 1,
    //   viewPosition: 0.5,
    // });
    expect(resetScrollGroups).toHaveBeenCalled();
  });

  it('should load groups and scroll to index 1', async () => {
    renderWithContext(<GroupsListScreen />, {
      initialState: { ...initialState, swipe: { groupScrollToId: '2' } },
    });
    await flushMicrotasksQueue();
    expect(getMyCommunities).toHaveBeenCalled();
    // TODO: Not sure how to test ref
    // expect(flatList.scrollToIndex).toHaveBeenCalledWith({
    //   animated: true,
    //   index: 1,
    //   viewPosition: 0.5,
    // });
    expect(resetScrollGroups).toHaveBeenCalled();
  });

  it('should load groups and not scroll to index', async () => {
    renderWithContext(<GroupsListScreen />, {
      initialState: {
        ...initialState,
        swipe: { groupScrollToId: 'doesnt exist' },
      },
    });
    await flushMicrotasksQueue();
    expect(getMyCommunities).toHaveBeenCalled();
    expect(resetScrollGroups).toHaveBeenCalled();
  });

  it('should refresh the list', () => {
    component
      .childAt(3)
      .props()
      .refreshControl.props.onRefresh();

    expect(checkForUnreadComments).toHaveBeenCalled();
    expect(getMyCommunities).toHaveBeenCalled();
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
