import configureStore from 'redux-mock-store';

import {
  NAVIGATE_FORWARD,
  STEPS_TAB,
  PEOPLE_TAB,
  GROUPS_TAB,
} from '../../constants';
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

  describe('checks unread comments on main tab navigation', () => {
    const test = routeName => {
      navigationAction = { type: NAVIGATE_FORWARD, routeName };

      store.dispatch(navigationAction);

      expect(checkForUnreadComments).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        navigationAction,
        checkCommentsResult,
      ]);
    };

    it('checks on steps tab', () => {
      test(STEPS_TAB);
    });

    it('checks on people tab', () => {
      test(PEOPLE_TAB);
    });

    it('checks on groups tab', () => {
      test(GROUPS_TAB);
    });
  });
});
