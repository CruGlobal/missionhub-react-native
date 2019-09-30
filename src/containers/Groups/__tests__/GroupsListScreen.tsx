import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { MockList } from 'graphql-tools';

import GroupsListScreen from '../GroupsListScreen';
import { renderShallow, renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { navigateToOrg } from '../../../actions/organizations';
import { trackActionWithoutData } from '../../../actions/analytics';
import { openMainMenu, keyExtractorId } from '../../../utils/common';
import { CREATE_GROUP_SCREEN } from '../CreateGroupScreen';
import { resetScrollGroups } from '../../../actions/swipe';
import { ACTIONS } from '../../../constants';
import {
  CREATE_COMMUNITY_UNAUTHENTICATED_FLOW,
  JOIN_BY_CODE_FLOW,
} from '../../../routes/constants';

jest.mock('../../../components/GroupCardItem', () => 'GroupCardItem');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/swipe');
jest.mock('../../../actions/analytics');
jest.mock('../../../utils/common');
jest.mock('../../TrackTabChange', () => () => null);

const auth = { isFirstTime: false };
const swipe = { groupScrollToId: null };
const initialState = { auth, swipe };

const usersReport = {
  id: 4,
  usersCount: 1123,
};
const community1 = {
  id: 1,
  name: 'Community 1',
  unreadCommentsCount: 0,
  userCreated: true,
  communityPhotoUrl: 'image.jpg',
  people: () => ({
    nodes: [{ id: 11, firstName: 'Owner', lastName: 'First' }],
  }),
  report: () => ({
    contactCount: 0,
    memberCount: 123,
    unassignedCount: 0,
  }),
};
const community2 = {
  id: 2,
  name: 'Community 2',
  unreadCommentsCount: 2,
  userCreated: false,
  communityPhotoUrl: 'photo.jpg',
  people: () => ({
    nodes: [{ id: 22, firstName: 'Owner', lastName: 'Second' }],
  }),
  report: () => ({
    contactCount: 222,
    memberCount: 234,
    unassignedCount: 333,
  }),
};

const Query = () => ({
  usersReport: () => usersReport,
  communities: () => ({
    nodes: [community1, community2],
  }),
});

const navigatePushResponse = { type: 'navigate push' };
const navigateToOrgResponse = { type: 'navigate to org' };
const trackActionResponse = { type: 'track action' };
const openMainMenuResponse = { type: 'open main menu' };
const keyExtractorResponse = { type: 'key extractor' };

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
  (navigateToOrg as jest.Mock).mockReturnValue(navigateToOrgResponse);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
  (openMainMenu as jest.Mock).mockReturnValue(openMainMenuResponse);
  (keyExtractorId as jest.Mock).mockReturnValue(keyExtractorResponse);
});

describe('GroupsListScreen', () => {
  it('renders with only global community', () => {
    renderWithContext(<GroupsListScreen />, { initialState }).snapshot();
  });

  it('renders with communities', async () => {
    const { snapshot } = renderWithContext(<GroupsListScreen />, {
      initialState,
      mocks: {
        Query,
      },
    });

    await flushMicrotasksQueue();
    snapshot();
  });

  describe('handlePress', () => {});
});

/*

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
  renderWithContext(<GroupsListScreen />, { initialState });
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
*/
