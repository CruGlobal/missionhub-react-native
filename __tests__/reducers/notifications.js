import notifications from '../../src/reducers/notifications';
import {
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  PUSH_NOTIFICATION_SET_TOKEN,
  PUSH_NOTIFICATION_REMINDER,
  LOGOUT,
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

it('updates set token', () => {
  const state = notifications({}, {
    type: PUSH_NOTIFICATION_SET_TOKEN,
    token: '123',
  });
  expect(state.token).toBe('123');
});

it('updates set token', () => {
  const state = notifications({}, {
    type: REQUESTS.SET_PUSH_TOKEN.SUCCESS,
    results: {
      findAll: () => [ { id: '9' } ],
    },
  });
  expect(state.pushDeviceId).toEqual('9');
});

it('resets state on logout', () => {
  let expectedState = {
    token: '',
    hasAsked: false,
    shouldAsk: true,
    showReminder: true,
    pushDeviceId: '',
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
