import { ToastAndroid, PushNotificationIOS } from 'react-native';
import PushNotification from 'react-native-push-notification';
import Config from 'react-native-config';

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
      return dispatch(registerNotificationHandler());
    }

    if (token || !showReminder) return;

    if (hasAsked) {
      PushNotification.checkPermissions((permission) => {
        const hasAllowedPermission = permission && permission.alert;
        if (hasAllowedPermission) return;

        dispatch(navigatePush(NOTIFICATION_OFF_SCREEN, {
          onClose: (askUser) => {
            if (askUser) {
              dispatch(enableAskPushNotification());
              dispatch(registerNotificationHandler());
            } else {
              dispatch(noNotificationReminder());
            }
            dispatch(navigateBack());
          },
        }));
      });
      return;
    }
    // If none of the other cases hit, show allow/not allow page
    dispatch(navigatePush(NOTIFICATION_PRIMER_SCREEN, {
      onComplete: () => dispatch(navigateBack()),
    }));
  };
}

export function reregisterNotificationHandler() {
  return (dispatch) => {
    if (isAndroid) {
      return dispatch(registerNotificationHandler());
    }

    PushNotification.checkPermissions((permission) => {
      const hasAllowedPermission = permission && permission.alert;
      if (hasAllowedPermission) {
        dispatch(registerNotificationHandler());
      }
    });
  };
}

export function registerNotificationHandler() {
  return async(dispatch, getState) => {
    PushNotification.configure({
      onRegister(t) {
        const { token } = getState().notifications;

        if (token === t.token) {
          return;
        }
        dispatch({ type: PUSH_NOTIFICATION_SET_TOKEN, token: t.token });
        //make api call to register token with user
        dispatch(registerPushDevice(t.token));
      },
      async onNotification(notification = {}) {
        await dispatch(handleNotification(notification));

        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // ANDROID ONLY: GCM Sender ID
      senderID: GCM_SENDER_ID,

      // we manually call this after to have access to a promise for the iOS prompt
      requestPermissions: false,
    });

    dispatch({ type: PUSH_NOTIFICATION_ASKED });

    return await PushNotification.requestPermissions();
  };
}

function handleNotification(notification) {
  return async(dispatch, getState) => {

    if (!notification.userInteraction) {
      // notification was not opened by the user from the notification area
      // so we do not need to navigate anywhere
      return;
    }

    const { isJean, user } = getState().auth;

    const { screen, person, organization } = isAndroid ?
      parseNotificationDataAndroid(notification) :
      parseNotificationDataIOS(notification);

    switch (screen) {
      case 'home':
      case 'steps':
        dispatch(navigateReset(MAIN_TABS));
        break;
      case 'person_steps':
        if (person) {
          const { response: loadedPerson } = await dispatch(getPersonDetails(person, organization));
          dispatch(navigatePush(CONTACT_SCREEN, { person: loadedPerson, organization: { id: organization } }));
        }
        break;
      case 'my_steps':
        dispatch(navigatePush(CONTACT_SCREEN, { person: user }));
        break;
      case 'add_a_person':
        dispatch(navigatePush(ADD_CONTACT_SCREEN, { isJean, organization: { id: organization }, onComplete: () => dispatch(navigateReset(MAIN_TABS)) }));
        break;
    }
  };
}

function parseNotificationDataIOS(notification) {
  const { data: { link: { data = {} } = {} } = {} } = notification;
  return {
    screen: data.screen,
    person: data.person_id,
    organization: data.organization_id,
  };
}

function parseNotificationDataAndroid(notification) {
  return {
    screen: notification.screen,
    person: notification.person_id,
    organization: notification.organization_id,
  };
}

function registerPushDevice(token) {
  return (dispatch) => {

    const data ={
      data: {
        type: 'push_notification_device_token',
        attributes: {
          token,
          platform: isAndroid ?
            'GCM' :
            Config.APNS_SANDBOX ? 'APNS_SANDBOX' : 'APNS',
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

export function toast(text, duration) {
  return () => {
    if (isAndroid) {
      const toastDuration = duration === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
      ToastAndroid.show(text, toastDuration);
    }
  };
}
