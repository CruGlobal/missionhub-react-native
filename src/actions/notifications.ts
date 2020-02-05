/* eslint complexity: 0 */

import { PushNotificationIOS } from 'react-native';
import PushNotification from 'react-native-push-notification';
import i18next from 'i18next';

import {
  LOAD_HOME_NOTIFICATION_REMINDER,
  REQUEST_NOTIFICATIONS,
  DISABLE_WELCOME_NOTIFICATION,
  GCM_SENDER_ID,
  GLOBAL_COMMUNITY_ID,
} from '../constants';
import { ADD_PERSON_THEN_STEP_SCREEN_FLOW } from '../routes/constants';
import { isAndroid } from '../utils/common';
import { NOTIFICATION_PRIMER_SCREEN } from '../containers/NotificationPrimerScreen';
import { NOTIFICATION_OFF_SCREEN } from '../containers/NotificationOffScreen';
import { GROUP_CHALLENGES } from '../containers/Groups/GroupScreen';
import { REQUESTS } from '../api/routes';

import { refreshCommunity } from './organizations';
import { getPersonDetails, navToPersonScreen } from './person';
import { reloadGroupChallengeFeed } from './challenges';
import {
  navigatePush,
  navigateBack,
  navigateToMainTabs,
  navigateToCommunity,
  navigateToCelebrateComments,
} from './navigation';
import callApi from './api';

// @ts-ignore
export function showNotificationPrompt(notificationType, doNotNavigateBack) {
  // @ts-ignore
  return (dispatch, getState) => {
    if (isAndroid) {
      return dispatch(requestNativePermissions());
    }

    return new Promise(resolve =>
      // @ts-ignore
      PushNotification.checkPermissions(permission => {
        // Android does not need to ask user for notification permissions
        if (permission && permission.alert) {
          return resolve(dispatch(requestNativePermissions()));
        }

        const { requestedNativePermissions } = getState().notifications;

        // @ts-ignore
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

// @ts-ignore
export function showReminderOnLoad(notificationType, doNotNavigateBack) {
  // @ts-ignore
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
  // @ts-ignore
  return async dispatch => {
    dispatch({ type: REQUEST_NOTIFICATIONS });
    const permission = await PushNotification.requestPermissions();
    return { acceptedNotifications: !!(permission && permission.alert) };
  };
}

export function configureNotificationHandler() {
  // @ts-ignore
  return (dispatch, getState) => {
    PushNotification.configure({
      // @ts-ignore
      onRegister(t) {
        const { pushDevice } = getState().notifications;

        if (pushDevice.token === t.token) {
          return;
        }
        //make api call to register token with user
        dispatch(registerPushDevice(t.token));
      },
      // @ts-ignore
      async onNotification(notification = {}) {
        await dispatch(handleNotification(notification));
        // @ts-ignore
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // ANDROID ONLY: GCM Sender ID
      senderID: GCM_SENDER_ID,

      // we manually call this after to have access to a promise for the iOS prompt
      requestPermissions: false,
    });
  };
}

// @ts-ignore
function handleNotification(notification) {
  // @ts-ignore
  return async (dispatch, getState) => {
    if (isAndroid && !notification.userInteraction) {
      return;
    }

    const { person: me } = getState().auth;

    const notificationData = parseNotificationData(notification);
    const {
      screen,
      person_id,
      celebration_item_id,
      organization_id,
    } = notificationData;

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
        // @ts-ignore
        return dispatch(navToPersonScreen(me));
      case 'add_a_person':
        return dispatch(
          navigatePush(ADD_PERSON_THEN_STEP_SCREEN_FLOW, {
            organization: { id: organization_id },
          }),
        );
      case 'celebrate_feed':
        if (organization_id) {
          const community = await dispatch(refreshCommunity(organization_id));
          return dispatch(navigateToCommunity(community));
        }
      case 'celebrate':
      case 'celebrate_item':
        if (organization_id) {
          const community = await dispatch(refreshCommunity(organization_id));
          return dispatch(
            navigateToCelebrateComments(community, celebration_item_id),
          );
        }
        return;
      case 'community_challenges':
        // IOS Global Community Challenges PN returns the organization_id as null
        const orgId =
          organization_id === null ? GLOBAL_COMMUNITY_ID : organization_id;
        const community = await dispatch(refreshCommunity(orgId));
        await dispatch(reloadGroupChallengeFeed(orgId));
        return dispatch(navigateToCommunity(community, GROUP_CHALLENGES));
    }
  };
}

// @ts-ignore
export function parseNotificationData(notification) {
  const { data: { link: { data: iosData = {} } = {} } = {} } = notification;
  const data = {
    ...notification,
    ...(typeof notification.screen_extra_data === 'string' &&
    notification.screen_extra_data !== ''
      ? JSON.parse(notification.screen_extra_data)
      : notification.screen_extra_data),
    ...iosData,
    ...(typeof iosData.screen_extra_data === 'string' &&
    iosData.screen_extra_data !== ''
      ? JSON.parse(iosData.screen_extra_data)
      : iosData.screen_extra_data),
  };

  return {
    screen: data.screen,
    person_id: data.person_id,
    organization_id: data.organization_id,
    celebration_item_id: data.celebration_item_id,
  };
}

// @ts-ignore
function registerPushDevice(token) {
  // @ts-ignore
  return dispatch => {
    const data = {
      data: {
        type: 'push_notification_device_token',
        attributes: {
          token,
          platform: isAndroid ? 'GCM' : __DEV__ ? 'APNS_SANDBOX' : 'APNS',
        },
      },
    };

    return dispatch(callApi(REQUESTS.SET_PUSH_TOKEN, { include: '' }, data));
  };
}

export function deletePushToken() {
  // @ts-ignore
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
  // @ts-ignore
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
