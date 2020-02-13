import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { JOIN_GROUP_SCREEN } from '../../../containers/Groups/JoinGroupScreen';
import { JoinByCodeFlowScreens } from '../joinByCodeFlow';
import { renderShallow } from '../../../../testUtils';
import { checkNotifications } from '../../../actions/notifications';
import { joinCommunity } from '../../../actions/organizations';
import {
  GROUP_TAB_SCROLL_ON_MOUNT,
  NOTIFICATION_PROMPT_TYPES,
} from '../../../constants';

jest.mock('../../../actions/api');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/organizations');

const store = configureStore([thunk])({ auth: { person: { id: '1' } } });

const community = { id: '1', community_code: '123456' };

beforeEach(() => {
  store.clearActions();
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    // @ts-ignore
    joinCommunity.mockReturnValue(() => Promise.resolve());
    // @ts-ignore
    checkNotifications.mockReturnValue(() => Promise.resolve());

    const WrappedJoinGroupScreen =
      JoinByCodeFlowScreens[JOIN_GROUP_SCREEN].screen;

    await store.dispatch(
      renderShallow(<WrappedJoinGroupScreen />, store)
        .instance()
        // @ts-ignore
        .props.next({ community }),
    );

    expect(joinCommunity).toHaveBeenCalledWith(
      community.id,
      community.community_code,
    );
    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.JOIN_COMMUNITY,
      expect.any(Function),
    );
    expect(store.getActions()).toEqual([
      { type: GROUP_TAB_SCROLL_ON_MOUNT, value: '1' },
    ]);
  });
});
