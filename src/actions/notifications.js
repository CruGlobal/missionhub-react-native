/* eslint complexity: 0 */

import { PushNotificationIOS } from 'react-native';
import PushNotification from 'react-native-push-notification';
import Config from 'react-native-config';
import i18next from 'i18next';

import {
  LOAD_HOME_NOTIFICATION_REMINDER,
  MAIN_TABS,
  REQUEST_NOTIFICATIONS,
} from '../constants';
import { DISABLE_WELCOME_NOTIFICATION, GCM_SENDER_ID } from '../constants';
import { isAndroid } from '../utils/common';
import { NOTIFICATION_PRIMER_SCREEN } from '../containers/NotificationPrimerScreen';
import { NOTIFICATION_OFF_SCREEN } from '../containers/NotificationOffScreen';
import { ADD_CONTACT_SCREEN } from '../containers/AddContactScreen';
import { GROUP_CHALLENGES } from '../containers/Groups/GroupScreen';

import { navigateToOrg } from './organizations';
import { getPersonDetails, navToPersonScreen } from './person';
import { navigatePush, navigateBack, navigateReset } from './navigation';
import callApi, { REQUESTS } from './api';

export function showNotificationPrompt(notificationType, doNotNavigateBack) {
  return (dispatch, getState) => {
    return new Promise(resolve =>
      PushNotification.checkPermissions(permission => {
        // Android does not need to ask user for notification permissions
        if (isAndroid || (permission && permission.alert)) {
          return resolve(dispatch(requestNativePermissions()));
        }

        const { requestedNativePermissions } = getState().notifications;

        const onComplete = acceptedNotifications => {
          !doNotNavigateBack && dispatch(navigateBack());
          resolve({ acceptedNotifications });
        };

        dispatch(
          navigatePush(
            requestedNativePermissions
              ? NOTIFICATION_OFF_SCREEN
              : NOTIFICATION_PRIMER_SCREEN,
            {
              onComplete,
              notificationType,
            },
          ),
        );
      }),
    );
  };
}

export function showReminderOnLoad(notificationType) {
  return (dispatch, getState) => {
    if (getState().notifications.showReminderOnLoad) {
      dispatch({ type: LOAD_HOME_NOTIFICATION_REMINDER });
      dispatch(showNotificationPrompt(notificationType));
    }
  };
}

export function requestNativePermissions() {
  return async dispatch => {
    dispatch({ type: REQUEST_NOTIFICATIONS });
    const permission = await PushNotification.requestPermissions();
    return { acceptedNotifications: !!(permission && permission.alert) };
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
  return async (dispatch, getState) => {
    if (isAndroid && !notification.userInteraction) {
      return;
    }

    const { person: me } = getState().auth;

    const notificationData = parseNotificationData(notification);
    const { screen, person } = notificationData;
    const organization =
      notificationData.organization && `${notificationData.organization}`;

    switch (screen) {
      case 'home':
      case 'steps':
        return dispatch(navigateReset(MAIN_TABS));
      case 'person_steps':
        if (person) {
          const { person: loadedPerson } = await dispatch(
            getPersonDetails(person, organization),
          );
          return dispatch(
            navToPersonScreen(loadedPerson, { id: organization }),
          );
        }
        return;
      case 'my_steps':
        return dispatch(navToPersonScreen(me));
      case 'add_a_person':
        return dispatch(
          navigatePush(ADD_CONTACT_SCREEN, {
            organization: { id: organization },
            onComplete: () => dispatch(navigateReset(MAIN_TABS)),
          }),
        );
      case 'celebrate':
        return dispatch(navigateToOrg(organization));
      case 'community_challenges':
        return dispatch(navigateToOrg(organization, GROUP_CHALLENGES));
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
  return dispatch => {
    const data = {
      data: {
        type: 'push_notification_device_token',
        attributes: {
          token,
          platform: isAndroid ? 'GCM' : Config.APNS_MODE,
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
