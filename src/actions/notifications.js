/* eslint complexity: 0 */

import { PushNotificationIOS } from 'react-native';
import PushNotification from 'react-native-push-notification';
import Config from 'react-native-config';
import i18next from 'i18next';

import {
  LOAD_HOME_NOTIFICATION_REMINDER,
  REQUEST_NOTIFICATIONS,
  DISABLE_WELCOME_NOTIFICATION,
  GCM_SENDER_ID,
} from '../constants';
import { ADD_PERSON_THEN_STEP_SCREEN_FLOW } from '../routes/constants';
import { isAndroid } from '../utils/common';
import { NOTIFICATION_PRIMER_SCREEN } from '../containers/NotificationPrimerScreen';
import { NOTIFICATION_OFF_SCREEN } from '../containers/NotificationOffScreen';
import { GROUP_CHALLENGES } from '../containers/Groups/GroupScreen';
import { REQUESTS } from '../api/routes';

import {
  refreshCommunity,
  navigateToCommunity,
  navigateToCelebrateComments,
} from './organizations';
import { getPersonDetails, navToPersonScreen } from './person';
import { reloadGroupChallengeFeed } from './challenges';
import { reloadGroupCelebrateFeed } from './celebration';
import { navigatePush, navigateBack, navigateToMainTabs } from './navigation';
import callApi from './api';

export function showNotificationPrompt(notificationType, doNotNavigateBack) {
  return (dispatch, getState) => {
    if (isAndroid) {
      return dispatch(requestNativePermissions());
    }

    return new Promise(resolve =>
      PushNotification.checkPermissions(permission => {
        // Android does not need to ask user for notification permissions
        if (permission && permission.alert) {
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

export function showReminderOnLoad(notificationType, doNotNavigateBack) {
  return async (dispatch, getState) => {
    if (getState().notifications.showReminderOnLoad) {
      dispatch({ type: LOAD_HOME_NOTIFICATION_REMINDER });
      await dispatch(
        showNotificationPrompt(notificationType, doNotNavigateBack),
      );
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
    const { screen, person_id, celebration_item_id } = notificationData;
    const organization_id =
      notificationData.organization_id && `${notificationData.organization_id}`;

    switch (screen) {
      case 'home':
      case 'steps':
        return dispatch(navigateToMainTabs());
      case 'person_steps':
        if (person_id) {
          const { person } = await dispatch(
            getPersonDetails(person_id, organization_id),
          );
          return dispatch(navToPersonScreen(person, { id: organization_id }));
        }
        return;
      case 'my_steps':
        return dispatch(navToPersonScreen(me));
      case 'add_a_person':
        return dispatch(
          navigatePush(ADD_PERSON_THEN_STEP_SCREEN_FLOW, {
            organization: { id: organization_id },
          }),
        );
      case 'celebrate':
        if (organization_id) {
          const community = await refreshCommunity(organization_id);
          await reloadGroupCelebrateFeed(organization_id);
          return dispatch(
            navigateToCelebrateComments(community, celebration_item_id),
          );
        }
        return;
      case 'community_challenges':
        if (organization_id) {
          const community = await refreshCommunity(organization_id);
          await reloadGroupChallengeFeed(organization_id);
          return dispatch(navigateToCommunity(community, GROUP_CHALLENGES));
        }
        return;
    }
  };
}

function parseNotificationData(notification) {
  const { data: { link: { data: iosData = {} } = {} } = {} } = notification;
  const data = {
    ...notification,
    ...notification.screen_extra_data,
    ...iosData,
    ...iosData.screen_extra_data,
  };

  return {
    screen: data.screen,
    person_id: data.person_id,
    organization_id: data.organization_id,
    celebration_item_id: data.celebration_item_id,
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
