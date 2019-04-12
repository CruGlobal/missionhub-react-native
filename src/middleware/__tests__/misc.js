import configureStore from 'redux-mock-store';

import { NAVIGATE_FORWARD, STEPS_TAB } from '../../constants';
import misc from '../misc';
import { checkForUnreadComments } from '../../actions/unreadComments';

jest.mock('../../actions/unreadComments');

const mockStore = configureStore([misc]);
let store;
let navigationAction;

const checkCommentsResult = { type: 'check unread comments' };

beforeEach(() => {
  checkForUnreadComments.mockReturnValue(checkCommentsResult);
});

describe('navigate forward', () => {
  beforeEach(() => (store = mockStore()));

  it('tracks main tab', () => {
    navigationAction = { type: NAVIGATE_FORWARD, routeName: STEPS_TAB };

    store.dispatch(navigationAction);

    expect(checkForUnreadComments).toHaveBeenCalled();
    expect(store.getActions()).toEqual([navigationAction, checkCommentsResult]);
  });
});
