import { ToastAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';

import { REQUESTS } from './api';
import callApi from './api';

import {
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  PUSH_NOTIFICATION_SET_TOKEN,
  PUSH_NOTIFICATION_REMINDER,
} from '../constants';
import { isAndroid } from '../utils/common';


export function disableAskPushNotification() {
  return {
    type: PUSH_NOTIFICATION_SHOULD_ASK,
    bool: false,
  };
}

export function enableAskPushNotification() {
  return {
    type: PUSH_NOTIFICATION_SHOULD_ASK,
    bool: true,
  };
}

export function noNotificationReminder(showReminder = false) {
  return {
    type: PUSH_NOTIFICATION_REMINDER,
    bool: showReminder,
  };
}

export function setupPushNotifications() {
  return (dispatch, getState) => {
    const { token, shouldAsk, isRegistered } = getState().notifications;
    if (!shouldAsk) return;
    // TODO: Remove this when testing notification callback
    // Don't bother getting this stuff if there is already a token
    if (token && isRegistered) {
      return;
    }

    // LOG('asking for push notification token');

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister(token) {
        dispatch({ type: PUSH_NOTIFICATION_SET_TOKEN, token: token.token });
        //make api call to register token with user
        dispatch(registerPushDevice(token.token));
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification(notification) {
        let state;
        if (notification && notification.foreground && !notification.userInteraction) {
          state = 'foreground';
        } else if (notification && !notification.foreground && !notification.userInteraction) {
          state = 'background';
        } else {
          state = 'open';
        }
        dispatch(handleNotifications(state, notification));
      },
      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      // senderID: CONSTANTS.GCM_SENDER_ID,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
      requestPermissions: true,
    });

    if (!getState().notifications.hasAskedPushNotification) {
      dispatch({ type: PUSH_NOTIFICATION_ASKED });
    }
  };
}


export function registerPushDevice(token) {
  return (dispatch) => {
    const type = DeviceInfo.getManufacturer();
    const data ={
      data: {
        type: 'push_notification_device_token',
        attributes: {
          token,
          platform: type === 'Apple' ? 'APNS_SANDBOX' : 'GCM',
        },
      },
    };

    return dispatch(callApi(REQUESTS.SET_PUSH_TOKEN, {}, data));
  };
}

export function handleNotifications(state, notification) {
  return () => {
    console.log('Notification state', state, notification);
  };
}

export function toast(text, duration) {
  return () => {
    if (isAndroid) {
      const toastDuration = duration === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
      ToastAndroid.show(text, toastDuration);
    }
  };
}
