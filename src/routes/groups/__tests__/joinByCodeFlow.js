import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { JOIN_GROUP_SCREEN } from '../../../containers/Groups/JoinGroupScreen';
import { JoinByCodeFlowScreens } from '../joinByCodeFlow';
import { renderShallow } from '../../../../testUtils';
import { joinCommunity } from '../../../actions/organizations';
import { GROUP_TAB_SCROLL_ON_MOUNT } from '../../../constants';

jest.mock('../../../actions/api');
jest.mock('../../../actions/organizations');

const store = configureStore([thunk])({ auth: { person: { id: '1' } } });

const community = { id: '1', community_code: '123456' };

beforeEach(() => {
  store.clearActions();
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    joinCommunity.mockReturnValue(() => Promise.resolve());

    const WrappedJoinGroupScreen =
      JoinByCodeFlowScreens[JOIN_GROUP_SCREEN].screen;

    await store.dispatch(
      renderShallow(<WrappedJoinGroupScreen />, store)
        .instance()
        .props.next({ community }),
    );

    expect(joinCommunity).toHaveBeenCalledWith(
      community.id,
      community.community_code,
    );
    expect(store.getActions()).toEqual([
      { type: GROUP_TAB_SCROLL_ON_MOUNT, value: '1' },
      {
        actions: [
          {
            params: { startTab: 'groups' },
            routeName: 'nav/MAIN_TABS',
            type: 'Navigation/NAVIGATE',
          },
        ],
        index: 0,
        key: null,
        type: 'Navigation/RESET',
      },
    ]);
  });
});
