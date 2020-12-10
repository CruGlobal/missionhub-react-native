import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { DeepLinkJoinCommunityAuthenticatedScreens } from '../deepLinkJoinCommunityAuthenticated';
import { renderWithContext } from '../../../../testUtils';
import callApi from '../../../actions/api';
import { loadHome } from '../../../actions/auth/userData';
import {
  joinCommunity,
  lookupOrgCommunityUrl,
} from '../../../actions/organizations';
import { setScrollGroups } from '../../../actions/swipe';
import { DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN } from '../../../containers/Groups/DeepLinkConfirmJoinGroupScreen';
import { navigatePush } from '../../../actions/navigation';
import { COMMUNITY_TABS } from '../../../containers/Communities/Community/constants';
import { trackScreenChange } from '../../../actions/analytics';

jest.mock('../../../actions/api');
jest.mock('../../../actions/auth/userData');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/swipe');
jest.mock('../../../actions/analytics');

const community = {
  id: '1',
  community_url: '1234567890123456',
  name: 'Test Community',
};

const initialState = {
  onboarding: {
    community,
  },
  drawer: {},
  analytics: {},
};

const loadHomeResponse = { type: 'load home' };
const joinCommunityResponse = { type: 'join community' };
const setScrollGroupsResponse = { type: 'set scroll groups' };
const navigatePushResponse = { type: 'navigatePush' };
const trackScreenChangeResponse = { type: 'track screen change' };

beforeEach(() => {
  (callApi as jest.Mock).mockReturnValue(() => Promise.resolve());
  (loadHome as jest.Mock).mockReturnValue(loadHomeResponse);
  (joinCommunity as jest.Mock).mockReturnValue(joinCommunityResponse);
  (setScrollGroups as jest.Mock).mockReturnValue(setScrollGroupsResponse);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResponse);
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    (lookupOrgCommunityUrl as jest.Mock).mockReturnValue(() =>
      Promise.resolve(community),
    );

    const Component =
      DeepLinkJoinCommunityAuthenticatedScreens[
        DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN
      ].screen;

    const { store, getByTestId } = renderWithContext(<Component />, {
      initialState,
      navParams: { communityUrlCode: '1234567890123456' },
    });

    await flushMicrotasksQueue();

    fireEvent(getByTestId('groupCardItem'), 'onJoin');

    await flushMicrotasksQueue();

    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_TABS, {
      communityId: community.id,
    });

    expect(store.getActions()).toEqual([
      trackScreenChangeResponse,
      joinCommunityResponse,
      loadHomeResponse,
      setScrollGroupsResponse,
      navigatePushResponse,
    ]);
  });
});
