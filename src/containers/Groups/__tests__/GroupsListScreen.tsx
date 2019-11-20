import React from 'react';
import { FlatList } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import GroupsListScreen from '../GroupsListScreen';
import { renderWithContext } from '../../../../testUtils';
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

const auth = { upgradeToken: null };
const swipe = { groupScrollToId: null };
const initialState = { auth, swipe };

const usersReport = {
  id: 4,
  usersCount: 1123,
};
const community1 = {
  id: '1',
  name: 'Community 1',
  unreadCommentsCount: 0,
  userCreated: true,
  communityPhotoUrl: 'image.jpg',
  people: () => ({
    nodes: [{ id: '11', firstName: 'Owner', lastName: 'First' }],
  }),
  report: () => ({
    contactCount: 0,
    memberCount: 123,
    unassignedCount: 0,
  }),
};
const community2 = {
  id: '2',
  name: 'Community 2',
  unreadCommentsCount: 2,
  userCreated: false,
  communityPhotoUrl: 'photo.jpg',
  people: () => ({
    nodes: [{ id: '22', firstName: 'Owner', lastName: 'Second' }],
  }),
  report: () => ({
    contactCount: 222,
    memberCount: 234,
    unassignedCount: 333,
  }),
};

const communities = [community1, community2];

const Query = () => ({
  usersReport: () => usersReport,
  communities: () => ({
    nodes: communities,
  }),
});

const navigatePushResponse = { type: 'navigate push' };
const navigateToOrgResponse = { type: 'navigate to org' };
const trackActionResponse = { type: 'track action' };
const openMainMenuResponse = { type: 'open main menu' };
const keyExtractorResponse = { type: 'key extractor' };
const resetScrollGroupsResponse = { type: 'reset scroll groups' };

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
  (navigateToOrg as jest.Mock).mockReturnValue(navigateToOrgResponse);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
  (openMainMenu as jest.Mock).mockReturnValue(openMainMenuResponse);
  (keyExtractorId as jest.Mock).mockReturnValue(keyExtractorResponse);
  (resetScrollGroups as jest.Mock).mockReturnValue(resetScrollGroupsResponse);
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

  describe('card item press', () => {
    it('navigates to group screen', async () => {
      const { getAllByTestId, store } = renderWithContext(
        <GroupsListScreen />,
        {
          initialState,
          mocks: {
            Query,
          },
        },
      );

      await flushMicrotasksQueue();
      const groupCard = getAllByTestId('GroupCard')[1];

      fireEvent(groupCard, 'onPress', groupCard.props.group);

      expect(navigateToOrg).toHaveBeenCalledWith(communities[0].id);
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.SELECT_COMMUNITY,
      );
      expect(store.getActions()).toEqual([
        navigateToOrgResponse,
        trackActionResponse,
      ]);
    });
  });

  describe('main menu icon press', () => {
    it('should open main menu', () => {
      const { getByTestId, store } = renderWithContext(<GroupsListScreen />, {
        initialState,
      });

      fireEvent.press(getByTestId('IconButton'));
      expect(openMainMenu).toHaveBeenCalled();
      expect(store.getActions()).toEqual([openMainMenuResponse]);
    });
  });

  describe('mounts with scrollToIndex', () => {
    it('should scroll to index 0', async () => {
      renderWithContext(<GroupsListScreen />, {
        initialState: { ...initialState, swipe: { groupScrollToId: '1' } },
      });

      await flushMicrotasksQueue();
      // TODO: Not sure how to test ref
      // expect(flatList.scrollToIndex).toHaveBeenCalledWith({
      //   animated: true,
      //   index: 1,
      //   viewPosition: 0.5,
      // });
      expect(resetScrollGroups).toHaveBeenCalledWith();
    });

    it('should not scroll to index when ScrollToId is null', async () => {
      renderWithContext(<GroupsListScreen />, {
        initialState: {
          ...initialState,
          swipe: { groupScrollToId: null },
        },
      });

      await flushMicrotasksQueue();
      // TODO: Not sure how to test ref
      // expect(flatList.scrollToIndex).not.toHaveBeenCalled();
      expect(resetScrollGroups).not.toHaveBeenCalled();
    });

    it('should not scroll to index when ScrollToId is not found', async () => {
      renderWithContext(<GroupsListScreen />, {
        initialState: {
          ...initialState,
          swipe: { groupScrollToId: 'ID' },
        },
      });

      await flushMicrotasksQueue();
      // TODO: Not sure how to test ref
      // expect(flatList.scrollToIndex).not.toHaveBeenCalled();
      expect(resetScrollGroups).not.toHaveBeenCalled();
    });
  });

  describe('join community button press', () => {
    it('navigates to join community screen', () => {
      const { getByTestId, store } = renderWithContext(<GroupsListScreen />, {
        initialState,
      });

      fireEvent.press(getByTestId('joinCommunity'));

      expect(navigatePush).toHaveBeenCalledWith(JOIN_BY_CODE_FLOW);
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('create community button press', () => {
    it('navigates to create community screen if signed', () => {
      const { getByTestId, store } = renderWithContext(<GroupsListScreen />, {
        initialState,
      });

      fireEvent.press(getByTestId('createCommunity'));

      expect(navigatePush).toHaveBeenCalledWith(CREATE_GROUP_SCREEN);
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });

    it('navigates to Upgrade Account Screen if not signed in', () => {
      const { getByTestId, store } = renderWithContext(<GroupsListScreen />, {
        initialState: {
          ...initialState,
          auth: { upgradeToken: 'aabbcc' },
        },
      });

      fireEvent.press(getByTestId('createCommunity'));

      expect(navigatePush).toHaveBeenCalledWith(
        CREATE_COMMUNITY_UNAUTHENTICATED_FLOW,
      );
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('handleScroll', () => {
    const communitiesForPagination = [
      { name: 'Community 1' },
      { name: 'Community 2' },
      { name: 'Community 3' },
      { name: 'Community 4' },
      { name: 'Community 5' },
      { name: 'Community 6' },
      { name: 'Community 7' },
      { name: 'Community 8' },
      { name: 'Community 9' },
      { name: 'Community 10' },
      { name: 'Community 11' },
      { name: 'Community 12' },
    ];
    let query: () => {};

    const testScroll = async () => {
      const { recordSnapshot, diffSnapshot, getByType } = renderWithContext(
        <GroupsListScreen />,
        {
          initialState,
          mocks: {
            Query: query,
          },
        },
      );

      await flushMicrotasksQueue();

      const flatList = getByType(FlatList);

      const scrollDown = (offset: number) =>
        fireEvent.scroll(flatList, {
          nativeEvent: {
            layoutMeasurement: { height: 400, width: 400 },
            contentOffset: { x: 0, y: offset },
            contentSize: { height: 800, width: 400 },
          },
        });

      return {
        scrollDown,
        recordSnapshot,
        diffSnapshot,
        flushMicrotasksQueue,
      };
    };

    it('paginates when close to bottom', async () => {
      query = () => ({
        usersReport: () => usersReport,
        communities: () => ({
          nodes: communitiesForPagination,
          pageInfo: { hasNextPage: true },
        }),
      });

      const {
        scrollDown,
        recordSnapshot,
        diffSnapshot,
        flushMicrotasksQueue,
      } = await testScroll();

      recordSnapshot();

      scrollDown(380);
      await flushMicrotasksQueue();

      diffSnapshot();
    });

    it('should not load more when not scrolling close to bottom', async () => {
      query = () => ({
        usersReport: () => usersReport,
        communities: () => ({
          nodes: communitiesForPagination,
          pageInfo: { hasNextPage: true },
        }),
      });

      const {
        scrollDown,
        recordSnapshot,
        diffSnapshot,
        flushMicrotasksQueue,
      } = await testScroll();

      recordSnapshot();

      scrollDown(379);
      await flushMicrotasksQueue();

      diffSnapshot();
    });

    it('should not load more when no next page', async () => {
      query = () => ({
        usersReport: () => usersReport,
        communities: () => ({
          nodes: communitiesForPagination,
          pageInfo: { hasNextPage: false },
        }),
      });

      const {
        scrollDown,
        recordSnapshot,
        diffSnapshot,
        flushMicrotasksQueue,
      } = await testScroll();

      recordSnapshot();

      scrollDown(380);
      await flushMicrotasksQueue();

      diffSnapshot();
    });
  });
});
