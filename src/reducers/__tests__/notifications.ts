import {
  HAS_SHOWN_NOTIFICATION_PROMPT,
  UPDATE_ACCEPTED_NOTIFICATIONS,
} from '../../actions/notifications';
import notifications, { PushDevice } from '../notifications';
import { LOGOUT } from '../../constants';
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
  const pushDevice = { id: '9', token: 'some token' };
  const state = notifications(undefined, {
    type: REQUESTS.SET_PUSH_TOKEN.SUCCESS,
    results: {
      response: pushDevice,
    },
  });
  expect(state).toEqual({
    pushDevice,
    appHasShownPrompt: false,
    userHasAcceptedNotifications: false,
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

it('should set userHasAcceptedNotifications to false', () => {
  const state = notifications(
    {
      pushDevice: null,
      appHasShownPrompt: false,
      userHasAcceptedNotifications: true,
    },
    {
      type: UPDATE_ACCEPTED_NOTIFICATIONS,
      acceptedNotifications: false,
    },
  );
  expect(state).toEqual({
    pushDevice: null,
    appHasShownPrompt: false,
    userHasAcceptedNotifications: false,
  });
});

it('resets state on logout', () => {
  const state = notifications(
    {
      pushDevice,
      appHasShownPrompt: true,
      userHasAcceptedNotifications: true,
    },
    {
      type: LOGOUT,
    },
  );
  expect(state).toEqual({
    pushDevice: null,
    appHasShownPrompt: true,
    userHasAcceptedNotifications: true,
  });
});
