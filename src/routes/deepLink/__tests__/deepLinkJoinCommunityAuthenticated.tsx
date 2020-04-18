import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DeepLinkJoinCommunityAuthenticatedScreens } from '../deepLinkJoinCommunityAuthenticated';
import { renderShallow } from '../../../../testUtils';
import callApi from '../../../actions/api';
import { loadHome } from '../../../actions/auth/userData';
import { joinCommunity } from '../../../actions/organizations';
import { setScrollGroups } from '../../../actions/swipe';
import { DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN } from '../../../containers/Groups/DeepLinkConfirmJoinGroupScreen';
import { navigatePush } from '../../../actions/navigation';
import { COMMUNITY_TABS } from '../../../containers/Communities/Community/CommunityTabs';

jest.mock('../../../actions/api');
jest.mock('../../../actions/auth/userData');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/swipe');

const community = { id: '1', community_url: '1234567890123456' };

const store = configureStore([thunk])({
  auth: { person: { id: '1' } },
  onboarding: {
    community,
  },
});

const loadHomeResponse = { type: 'load home' };
const joinCommunityResponse = { type: 'join community' };
const setScrollGroupsResponse = { type: 'set scroll groups' };
const navigatePushResponse = { type: 'navigatePush' };

beforeEach(() => {
  store.clearActions();
  (callApi as jest.Mock).mockReturnValue(() => Promise.resolve());
  (loadHome as jest.Mock).mockReturnValue(loadHomeResponse);
  (joinCommunity as jest.Mock).mockReturnValue(joinCommunityResponse);
  (setScrollGroups as jest.Mock).mockReturnValue(setScrollGroupsResponse);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    const Component =
      DeepLinkJoinCommunityAuthenticatedScreens[
        DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN
      ].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: { communityUrlCode: '1234567890123456' } },
          }}
        />,
        store,
      )
        .instance()
        // @ts-ignore
        .props.next({
          community,
        }),
    );

    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_TABS, {
      communityId: community.id,
    });

    expect(store.getActions()).toEqual([
      joinCommunityResponse,
      loadHomeResponse,
      setScrollGroupsResponse,
      navigatePushResponse,
    ]);
  });
});
