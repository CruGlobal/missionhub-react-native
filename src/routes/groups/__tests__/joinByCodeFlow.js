import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { JOIN_GROUP_SCREEN } from '../../../containers/Groups/JoinGroupScreen';
import { JoinByCodeFlowScreens } from '../joinByCodeFlow';
import { renderShallow } from '../../../../testUtils';
import callApi, { REQUESTS } from '../../../actions/api';
import { GROUP_TAB_SCROLL_ON_MOUNT } from '../../../constants';

jest.mock('../../../actions/api');

const store = configureStore([thunk])({ auth: { person: { id: '1' } } });

beforeEach(() => {
  store.clearActions();
  callApi.mockClear();
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    callApi.mockReturnValue(() => Promise.resolve());

    const WrappedJoinGroupScreen =
      JoinByCodeFlowScreens[JOIN_GROUP_SCREEN].screen;

    await store.dispatch(
      renderShallow(<WrappedJoinGroupScreen />, store)
        .instance()
        .props.next({ communityId: '1', communityCode: '123456' }),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.JOIN_COMMUNITY,
      {},
      {
        data: {
          attributes: {
            community_code: '123456',
            organization_id: '1',
            permission_id: 4,
            person_id: '1',
          },
          type: 'organizational_permission',
        },
      },
    );
    expect(store.getActions()).toEqual([
      { type: GROUP_TAB_SCROLL_ON_MOUNT, value: true },
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
