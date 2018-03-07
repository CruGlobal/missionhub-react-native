import { ToastAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';

import { REQUESTS } from './api';
import callApi from './api';
import { navigatePush, navigateBack, navigateReset } from './navigation';
import { getPersonDetails } from './person';
import { MAIN_TABS } from '../constants';
import {
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  PUSH_NOTIFICATION_SET_TOKEN,
  PUSH_NOTIFICATION_REMINDER,
  GCM_SENDER_ID,
} from '../constants';
import { isAndroid } from '../utils/common';
import { NOTIFICATION_OFF_SCREEN } from '../containers/NotificationOffScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../containers/NotificationPrimerScreen';
import { ADD_CONTACT_SCREEN } from '../containers/AddContactScreen'; //props: person, isJean, onComplete: () => {} }
import { CONTACT_SCREEN } from '../containers/ContactScreen'; //props: person, organization


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

export function showReminderScreen() {
  return (dispatch, getState) => {
    const { hasAsked, token, showReminder } = getState().notifications;

    // Android does not need to ask for notification permissions
    if (isAndroid) {
      return dispatch(setupPushNotifications());
    }

    if (token || !showReminder) return;
    if (hasAsked) {
      PushNotification.checkPermissions((permission) => {
        const hasAllowedPermission = permission && permission.alert;
        if (!hasAllowedPermission) {
          dispatch(navigatePush(NOTIFICATION_OFF_SCREEN, {
            onClose: (askUser) => {
              if (askUser) {
                dispatch(enableAskPushNotification());
                dispatch(setupPushNotifications());
              } else {
                dispatch(noNotificationReminder());
              }
              dispatch(navigateBack());
            },
          }));
        }
      });
      return;
    }
    // If none of the other cases hit, show allow/not allow page
    dispatch(navigatePush(NOTIFICATION_PRIMER_SCREEN, {
      onComplete: () => dispatch(navigateBack()),
    }));
  };
}

export function shouldRunSetUpPushNotifications() {
  return (dispatch) => {
    if (isAndroid) {
      return dispatch(setupPushNotifications());
    }
    PushNotification.checkPermissions((permission) => {
      const hasAllowedPermission = permission && permission.alert;
      if (hasAllowedPermission) {
        dispatch(setupPushNotifications());
      }
    });
  };
}

export function setupPushNotifications() {
  return (dispatch, getState) => {
    const { token, shouldAsk, isRegistered } = getState().notifications;
    if (!shouldAsk) return Promise.reject();
    PushNotification.configure({
      onRegister(t) {
        if (token && isRegistered) {
          return;
        }
        dispatch({ type: PUSH_NOTIFICATION_SET_TOKEN, token: t.token });
        //make api call to register token with user
        dispatch(registerPushDevice(t.token));
      },
      onNotification(notification) {
        console.warn('here', notification);
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
      senderID: GCM_SENDER_ID,

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
      requestPermissions: false,
    });

    if (!getState().notifications.hasAskedPushNotification) {
      dispatch({ type: PUSH_NOTIFICATION_ASKED });
    }

    if (isAndroid) {
      PushNotification.requestPermissions();
      return Promise.resolve();
    }

    return PushNotification.requestPermissions().then((p) => {
      LOG('permission resolved to', p);
      return p;
    });
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

export function deletePushToken(deviceId) {
  return (dispatch) => {
    const query ={
      deviceId,
    };

    return dispatch(callApi(REQUESTS.DELETE_PUSH_TOKEN, query, {}));
  };
}

export function handleNotifications(state, notification) {
  return (dispatch, getState) => {
    const isJean = getState().auth.isJean;
    let screen;
    let person;
    let organization;
    if (state === 'open') {
      if ((notification && notification.data && notification.data.link && notification.data.link.data) || (notification && notification.screen)) {
        if (isAndroid) {
          screen = notification.screen;
          person = notification.person_id;
          organization = notification.organization_id;
        } else {
          screen = notification.data.link.data.screen;
          person = notification.data.link.data.person_id;
          organization = notification.data.link.data.organization_id;
        }
        if (screen.includes('home')) {
          dispatch(navigateReset(MAIN_TABS));
        } else if (screen.includes('person_steps') && person) {
          dispatch(getPersonDetails(person, organization)).then((r) => {
            person = r.find('person', person);
            dispatch(navigatePush(CONTACT_SCREEN, { person, organization: { id: organization } }));
          });
        } else if (screen.includes('add_a_person')) {
          dispatch(navigatePush(ADD_CONTACT_SCREEN, { isJean, onComplete: () => dispatch(navigateReset(MAIN_TABS)) }));
        } else if (screen.includes('steps')) {
          dispatch(navigateReset(MAIN_TABS));
        } else if (screen.includes('my_steps')) {
          dispatch(navigateReset(MAIN_TABS));
        }
      }
    }
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
