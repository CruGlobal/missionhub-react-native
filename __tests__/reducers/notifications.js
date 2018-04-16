import notifications from '../../src/reducers/notifications';
import {
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  PUSH_NOTIFICATION_REMINDER,
  LOGOUT,
  DISABLE_WELCOME_NOTIFICATION,
} from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';

it('updates shouldAsk', () => {
  const state = notifications({}, {
    type: PUSH_NOTIFICATION_SHOULD_ASK,
    bool: true,
  });
  expect(state.shouldAsk).toBe(true);
});

it('updates hasAsked', () => {
  const state = notifications({}, {
    type: PUSH_NOTIFICATION_ASKED,
  });
  expect(state.hasAsked).toBe(true);
});

it('updates showReminder', () => {
  const state = notifications({}, {
    type: PUSH_NOTIFICATION_REMINDER,
    bool: false,
  });
  expect(state.showReminder).toBe(false);
});

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

it('resets state on logout', () => {
  let expectedState = {
    pushDevice: {},
    hasAsked: false,
    shouldAsk: true,
    showReminder: true,
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
