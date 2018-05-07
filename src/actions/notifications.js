import { ToastAndroid, PushNotificationIOS } from 'react-native';
import PushNotification from 'react-native-push-notification';
import Config from 'react-native-config';
import i18next from 'i18next';

import { REQUESTS } from './api';
import callApi from './api';
import { navigatePush, navigateBack, navigateReset } from './navigation';
import { getPersonDetails } from './person';
import { MAIN_TABS } from '../constants';
import {
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  DISABLE_WELCOME_NOTIFICATION,
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

export function showReminderScreen() {
  return (dispatch, getState) => {
    const { hasAsked, pushDevice, shouldAsk } = getState().notifications;

    // Android does not need to ask for notification permissions
    if (isAndroid) {
      return dispatch(registerNotificationHandler());
    }

    if (pushDevice.token || !shouldAsk) { return; }

    if (hasAsked) {
      PushNotification.checkPermissions((permission) => {
        const hasAllowedPermission = permission && permission.alert;
        if (hasAllowedPermission) { return; }

        dispatch(navigatePush(NOTIFICATION_OFF_SCREEN, {
          onClose: (askUser) => {
            if (askUser) {
              dispatch(enableAskPushNotification());
              dispatch(registerNotificationHandler());
            } else {
              dispatch(disableAskPushNotification());
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
  return (dispatch, getState) => {
    if (isAndroid) {
      return dispatch(registerNotificationHandler());
    }

    PushNotification.checkPermissions((permission) => {
      const hasAllowedPermission = permission && permission.alert;
      if (hasAllowedPermission) {
        dispatch(registerNotificationHandler());
      } else if (getState().steps.reminders.length > 0) {
        dispatch(showReminderScreen());
      }
    });
  };
}

export function registerNotificationHandler() {
  return async(dispatch) => {
    dispatch({ type: PUSH_NOTIFICATION_ASKED });
    return await PushNotification.requestPermissions();
  };
}

export function configureNotificationHandler() {
  return (dispatch, getState) => {
    PushNotification.configure({
      onRegister(t) {
        const { pushDevice } = getState().notifications;

        if (pushDevice.token === t.token) {
          return;
        }
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
  };
}

function handleNotification(notification) {
  return async(dispatch, getState) => {

    if (!notification.userInteraction) {
      // notification was not opened by the user from the notification area
      // so we do not need to navigate anywhere
      return;
    }

    const { isJean, person: me } = getState().auth;

    const { screen, person, organization } = parseNotificationData(notification);

    switch (screen) {
      case 'home':
      case 'steps':
        return dispatch(navigateReset(MAIN_TABS));
      case 'person_steps':
        if (person) {
          const { person: loadedPerson } = await dispatch(getPersonDetails(person, organization));
          return dispatch(navigatePush(CONTACT_SCREEN, { person: loadedPerson, organization: { id: organization } }));
        }
        return;
      case 'my_steps':
        return dispatch(navigatePush(CONTACT_SCREEN, { person: me }));
      case 'add_a_person':
        return dispatch(navigatePush(ADD_CONTACT_SCREEN, { isJean, organization: { id: organization }, onComplete: () => dispatch(navigateReset(MAIN_TABS)) }));
    }
  };
}

function parseNotificationData(notification) {
  const { data: { link: { data: iosData = {} } = {} } = {} } = notification;
  const data = {
    ...notification,
    ...iosData,
  };

  return {
    screen: data.screen,
    person: data.person_id,
    organization: data.organization_id,
  };
}

function registerPushDevice(token) {
  return (dispatch) => {

    const data = {
      data: {
        type: 'push_notification_device_token',
        attributes: {
          token,
          platform: isAndroid ?
            'GCM' :
            Config.APNS_MODE,
        },
      },
    };

    return dispatch(callApi(REQUESTS.SET_PUSH_TOKEN, { include: '' }, data));
  };
}

export function deletePushToken() {
  return (dispatch, getState) => {
    const { pushDevice } = getState().notifications;
    if (!pushDevice.id) {
      return;
    }

    const query = {
      deviceId: pushDevice.id,
    };

    return dispatch(callApi(REQUESTS.DELETE_PUSH_TOKEN, query, {}));
  };
}

export function showWelcomeNotification() {
  return (dispatch, getState) => {
    if (getState().notifications.hasShownWelcomeNotification) {
      return;
    }

    PushNotification.localNotificationSchedule({
      title: i18next.t('welcomeNotification:title'),
      message: i18next.t('welcomeNotification:message'),
      date: new Date(Date.now() + 1000 * 3), // in 3 secs
    });

    dispatch({
      type: DISABLE_WELCOME_NOTIFICATION,
    });
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
