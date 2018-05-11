import notifications from '../../src/reducers/notifications';
import {
  LOGOUT,
  DISABLE_WELCOME_NOTIFICATION,
  REQUEST_NOTIFICATIONS, LOAD_HOME_NOTIFICATION_REMINDER,
} from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';

it('should update push device', () => {
  const pushDevice = { id: '9', token: 'some token' };
  const state = notifications({}, {
    type: REQUESTS.SET_PUSH_TOKEN.SUCCESS,
    results: {
      response: pushDevice,
    },
  });
  expect(state.pushDevice).toEqual(pushDevice);
});

it('should disable welcome notification', () => {
  const state = notifications({}, {
    type: DISABLE_WELCOME_NOTIFICATION,
  });
  expect(state.hasShownWelcomeNotification).toEqual(true);
});

it('should set requestedNativePermissions to true', () => {
  const state = notifications({}, {
    type: REQUEST_NOTIFICATIONS,
  });
  expect(state.requestedNativePermissions).toEqual(true);
});

it('should set showReminderOnLoad to false', () => {
  const state = notifications({}, {
    type: LOAD_HOME_NOTIFICATION_REMINDER,
  });
  expect(state.showReminderOnLoad).toEqual(false);
});

it('resets state on logout', () => {
  let expectedState = {
    pushDevice: {},
    requestedNativePermissions: true,
    showReminderOnLoad: true,
    hasShownWelcomeNotification: false,
  };
  const state = notifications({
    requestedNativePermissions: true,
  }, {
    type: LOGOUT,
  });
  expect(state).toEqual(expectedState);
});

it('resets state on logout', () => {
  const state = notifications({}, {
    type: null,
  });
  expect(state).toEqual({});
});
