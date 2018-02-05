import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PushNotification from 'react-native-push-notification';

import {
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  PUSH_NOTIFICATION_SET_TOKEN,
  PUSH_NOTIFICATION_REMINDER,
} from '../../src/constants';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import { setupPushNotifications, registerPushDevice, disableAskPushNotification, enableAskPushNotification, noNotificationReminder } from '../../src/actions/notifications';
import { mockFnWithParams } from '../../testUtils';

let store;
const token = '123';

jest.mock('react-native-push-notification', () => ({
  configure: jest.fn((params) => {
    params.onRegister({ token: '123' });
    params.onNotification({ foreground: true, userInteraction: false });
  }),
  requestPermissions: jest.fn(() => Promise.resolve()),
}));


beforeEach(() => store = configureStore([ thunk ])());

const mockApi = (result, ...expectedParams) => mockFnWithParams(api, 'default', result, ...expectedParams);

describe('register push token', () => {
  beforeEach(() => store = configureStore([ thunk ])());
  const expectedData = {
    data: {
      type: 'push_notification_device_token',
      attributes: {
        token,
        platform: 'GCM',
      },
    },
  };
  const action = { type: 'registered' };

  beforeEach(() => mockApi(action, REQUESTS.SET_PUSH_TOKEN, {}, expectedData));

  it('should get people list', () => {
    store.dispatch(registerPushDevice(token));

    expect(store.getActions()[0]).toBe(action);
  });
});

describe('set push token', () => {
  const expectedData = {
    data: {
      type: 'push_notification_device_token',
      attributes: {
        token,
        platform: 'GCM',
      },
    },
  };
  const action = { type: 'registered' };

  beforeEach(() => mockApi(action, REQUESTS.SET_PUSH_TOKEN, {}, expectedData));

  beforeEach(() => store = configureStore([ thunk ])({
    notifications: {
      shouldAsk: true,
      token: null,
      isRegistered: false,
    },
  }));

  it('should not call configure', () => {
    store = configureStore([ thunk ])({
      notifications: {
        shouldAsk: false,
        token: null,
        isRegistered: false,
      },
    });
    store.dispatch(setupPushNotifications());

    expect(PushNotification.configure).toHaveBeenCalledTimes(0);
  });
  it('should not call configure with isRegistered true and token exists', () => {
    store = configureStore([ thunk ])({
      notifications: {
        token: '123',
        isRegistered: true,
      },
    });
    store.dispatch(setupPushNotifications());

    expect(PushNotification.configure).toHaveBeenCalledTimes(0);
  });
  it('should call configure', () => {
    store.dispatch(setupPushNotifications());

    expect(PushNotification.configure).toHaveBeenCalledTimes(1);
  });
  it('should call configure and onRegister', () => {
    store.dispatch(setupPushNotifications());

    expect(store.getActions()[0]).toEqual({ type: PUSH_NOTIFICATION_SET_TOKEN, token: '123' });
    expect(store.getActions()[1]).toBe(action);
  });
  it('should call configure and push notifications asked', () => {
    store.dispatch(setupPushNotifications());

    expect(store.getActions()[2]).toEqual({ type: PUSH_NOTIFICATION_ASKED });
  });
  it('should call request permissions', () => {
    store.dispatch(setupPushNotifications());

    expect(PushNotification.requestPermissions).toHaveBeenCalledTimes(1);
  });
});

describe('actions called', () => {
  it('should call disableAskPushNotification', () => {
    store.dispatch(disableAskPushNotification());

    expect(store.getActions()[0]).toEqual({ type: PUSH_NOTIFICATION_SHOULD_ASK, bool: false });
  });
  it('should call enableAskPushNotification', () => {
    store.dispatch(enableAskPushNotification());

    expect(store.getActions()[0]).toEqual({ type: PUSH_NOTIFICATION_SHOULD_ASK, bool: true });
  });
  it('should call noNotificationReminder', () => {
    store.dispatch(noNotificationReminder(true));
    store.dispatch(noNotificationReminder(false));

    expect(store.getActions()[0]).toEqual({ type: PUSH_NOTIFICATION_REMINDER, bool: true });
    expect(store.getActions()[1]).toEqual({ type: PUSH_NOTIFICATION_REMINDER, bool: false });
  });
});
