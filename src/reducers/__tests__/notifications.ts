import {
  HAS_SHOWN_NOTIFICATION_PROMPT,
  UPDATE_ACCEPTED_NOTIFICATIONS,
} from '../../actions/notifications';
import notifications, { PushDevice } from '../notifications';
import { LOGOUT } from '../../constants';
import {
  LOGOUT,
  DISABLE_WELCOME_NOTIFICATION,
  REQUEST_NOTIFICATIONS,
  LOAD_HOME_NOTIFICATION_REMINDER,
} from '../../constants';
import { REQUESTS } from '../../api/routes';

const pushDevice: PushDevice = {
  id: '9',
  token: 'some token',
  platform: 'GCM',
  user: {
    id: '1',
    __type: 'user',
  },
};

it('should update push device', () => {
  const state = notifications(undefined, {
    type: REQUESTS.SET_PUSH_TOKEN.SUCCESS,
    results: {
      response: pushDevice,
    },
  });
  expect(state).toEqual({
    pushDevice,
    appHasShownPrompt: false,
    userHasAcceptedNotifications: true,
  });
});

it('should delete push device', () => {
  const state = notifications(undefined, {
    type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS,
  });
  expect(state).toEqual({
    pushDevice: null,
    appHasShownPrompt: false,
    userHasAcceptedNotifications: false,
  });
});

it('should set appHasShownPrompt', () => {
  const state = notifications(undefined, {
    type: HAS_SHOWN_NOTIFICATION_PROMPT,
  });
  expect(state).toEqual({
    pushDevice: null,
    appHasShownPrompt: true,
    userHasAcceptedNotifications: false,
  });
});

it('should set userHasAcceptedNotifications to true', () => {
  const state = notifications(undefined, {
    type: UPDATE_ACCEPTED_NOTIFICATIONS,
    acceptedNotifications: true,
  });
  expect(state).toEqual({
    pushDevice: null,
    appHasShownPrompt: false,
    userHasAcceptedNotifications: true,
  });
});

it('resets state on logout', () => {
  const expectedState = {
    pushDevice: {},
    requestedNativePermissions: true,
    showReminderOnLoad: true,
    hasShownWelcomeNotification: false,
  };
  const state = notifications(
    // @ts-ignore
    {
      requestedNativePermissions: true,
    },
    {
      type: LOGOUT,
    },
  );
  expect(state).toEqual(expectedState);
});

it('resets state on logout', () => {
  const state = notifications(
    // @ts-ignore
    {},
    {
      type: null,
    },
  );
  expect(state).toEqual({});
});
