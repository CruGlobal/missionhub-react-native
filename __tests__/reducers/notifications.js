import notifications from '../../src/reducers/notifications';
import {
  LOGOUT,
  DISABLE_WELCOME_NOTIFICATION, ALLOW_NOTIFICATIONS,
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

it('should set hasAllowed to true', () => {
  const state = notifications({}, {
    type: ALLOW_NOTIFICATIONS,
  });
  expect(state.hasAllowed).toEqual(true);
});

it('resets state on logout', () => {
  let expectedState = {
    pushDevice: {},
    hasAllowed: false,
    hasShownWelcomeNotification: false,
  };
  const state = notifications({}, {
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
