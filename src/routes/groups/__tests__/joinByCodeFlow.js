import React from 'react';

import { JOIN_GROUP_SCREEN } from '../../../containers/Groups/JoinGroupScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../../../containers/NotificationPrimerScreen';
import { NOTIFICATION_OFF_SCREEN } from '../../../containers/NotificationOffScreen';
import { JoinByCodeFlowScreens } from '../joinByCodeFlow';
import { renderWithContext } from '../../../../testUtils';
import { checkNotifications } from '../../../actions/notifications';
import { navigateToMainTabs } from '../../../actions/navigation';
import { joinCommunity } from '../../../actions/organizations';
import { setScrollGroups } from '../../../actions/swipe';
import { NOTIFICATION_PROMPT_TYPES, GROUPS_TAB } from '../../../constants';

jest.mock('../../../actions/api');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/swipe');
jest.mock('../../../utils/hooks/useAnalytics');

const community = { id: '1', community_code: '123456' };

const joinCommunityResponse = { type: 'join community' };
const setScrollGroupsResponse = { type: 'set scroll groups' };
const checkNotificationsResponse = { type: 'check notifications' };
const navigateToMainTabsResponse = { type: 'navigate to main tabs' };

beforeEach(() => {
  joinCommunity.mockReturnValue(joinCommunityResponse);
  setScrollGroups.mockReturnValue(setScrollGroupsResponse);
  checkNotifications.mockImplementation((_, callback) => {
    callback();
    return checkNotificationsResponse;
  });
  navigateToMainTabs.mockReturnValue(navigateToMainTabsResponse);
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = JoinByCodeFlowScreens[JOIN_GROUP_SCREEN].screen;

    const { store, getByType } = renderWithContext(<Component />, {
      initialState: { auth: { person: { id: '1' } } },
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(
      originalComponent.props.next({
        community,
      }),
    );

    expect(joinCommunity).toHaveBeenCalledWith(
      community.id,
      community.community_code,
    );
    expect(setScrollGroups).toHaveBeenCalledWith(community.id);
    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.JOIN_COMMUNITY,
      expect.any(Function),
    );
    expect(navigateToMainTabs).toHaveBeenCalledWith(GROUPS_TAB);
    expect(store.getActions()).toEqual([
      joinCommunityResponse,
      setScrollGroupsResponse,
      navigateToMainTabsResponse,
      checkNotificationsResponse,
    ]);
  });
});

describe('NotificationPrimerScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = JoinByCodeFlowScreens[NOTIFICATION_PRIMER_SCREEN];

    const { store, getByType } = renderWithContext(<Component />, {
      initialState: { auth: { person: { id: '1' } } },
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(
      originalComponent.props.next({
        community,
      }),
    );

    expect(navigateToMainTabs).toHaveBeenCalledWith(GROUPS_TAB);
    expect(store.getActions()).toEqual([navigateToMainTabsResponse]);
  });
});

describe('NotificationOffScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = JoinByCodeFlowScreens[NOTIFICATION_OFF_SCREEN];

    const { store, getByType } = renderWithContext(<Component />, {
      initialState: { auth: { person: { id: '1' } } },
    });

    const originalComponent = getByType(Component).children[0];

    if (typeof originalComponent === 'string') {
      throw "Can't access component props";
    }

    await store.dispatch(
      originalComponent.props.next({
        community,
      }),
    );

    expect(navigateToMainTabs).toHaveBeenCalledWith(GROUPS_TAB);
    expect(store.getActions()).toEqual([navigateToMainTabsResponse]);
  });
});
