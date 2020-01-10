/* eslint complexity: 0 */

import { PushNotificationIOS } from 'react-native';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import RNPushNotification, {
  PushNotification,
} from 'react-native-push-notification';
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
import { NotificationsState } from '../reducers/notifications';
import { AuthState } from '../reducers/auth';
import { Person } from '../reducers/people';
import { Organization, OrganizationsState } from '../reducers/organizations';

import { refreshCommunity } from './organizations';
import { getPersonDetails, navToPersonScreen } from './person';
import { reloadGroupChallengeFeed } from './challenges';
import { reloadGroupCelebrateFeed } from './celebration';
import {
  navigatePush,
  navigateBack,
  navigateToMainTabs,
  navigateToCommunity,
  navigateToCelebrateComments,
} from './navigation';
import callApi from './api';

export interface MHPushNotification extends PushNotification {
  data: {
    link?: {
      data?: {
        screen: string;
        person_id: string;
        organization_id: string;
        celebration_item_id: string;
        screen_extra_data?: string;
      };
    };
  };
  screen?: string;
  person_id?: string;
  organization_id?: string;
  celebration_item_id?: string;
  screen_extra_data?: string;
}

/*export function showNotificationPrompt(notificationType, doNotNavigateBack) {
  return (dispatch, getState) => {
    if (isAndroid) {
      return dispatch(requestNativePermissions());
    }

    return new Promise(resolve =>
      RNPushNotification.checkPermissions(permission => {
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
}*/

/*export function showReminderOnLoad(notificationType, doNotNavigateBack) {
  return async (dispatch, getState) => {
    if (getState().notifications.showReminderOnLoad) {
      dispatch({ type: LOAD_HOME_NOTIFICATION_REMINDER });
      await dispatch(
        showNotificationPrompt(notificationType, doNotNavigateBack),
      );
    }
  };
}*/

export const requestNativePermissions = async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch({ type: REQUEST_NOTIFICATIONS });
  const permission = await RNPushNotification.requestPermissions();
  return { acceptedNotifications: !!(permission && permission.alert) };
};

export const configureNotificationHandler = (
  dispatch: ThunkDispatch<
    { auth: AuthState; organizations: OrganizationsState },
    {},
    AnyAction
  >,
  getState: () => { notifications: NotificationsState },
) => {
  RNPushNotification.configure({
    onRegister(t) {
      const { pushDevice } = getState().notifications;

      if (pushDevice && pushDevice.token === t.token) {
        return;
      }

      //make api call to register token with user
      dispatch(setPushDevice(t.token));
    },
    async onNotification(notification: MHPushNotification) {
      notification && (await dispatch(handleNotification(notification)));

      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    // ANDROID ONLY: GCM Sender ID
    senderID: GCM_SENDER_ID,
    // we manually call this after to have access to a promise for the iOS prompt
    requestPermissions: false,
  });
};

const handleNotification = (notification: MHPushNotification) => async (
  dispatch: ThunkDispatch<{ organizations: OrganizationsState }, {}, AnyAction>,
  getState: () => { auth: AuthState },
) => {
  if (isAndroid && notification.userInteraction) {
    return;
  }

  const { person: me } = getState().auth;

  const {
    screen,
    person_id,
    celebration_item_id,
    organization_id,
  } = parseNotificationData(notification);

  switch (screen) {
    case 'home':
    case 'steps':
      return dispatch(navigateToMainTabs());
    case 'person_steps':
      if (person_id) {
        const { person }: { person: Person } = await dispatch(
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
      if (organization_id && celebration_item_id) {
        const community: Organization = await dispatch(
          refreshCommunity(organization_id),
        );
        await dispatch(reloadGroupCelebrateFeed(organization_id));
        return dispatch(
          navigateToCelebrateComments(community, celebration_item_id),
        );
      }
      return;
    case 'community_challenges':
      const community: Organization = await dispatch(
        refreshCommunity(organization_id),
      );
      await dispatch(reloadGroupChallengeFeed(organization_id));
      return dispatch(navigateToCommunity(community, GROUP_CHALLENGES));
  }
};

export function parseNotificationData(notification: MHPushNotification) {
  const {
    data: { link: { data: iosData = undefined } = {} },
  } = notification;

  const data = {
    ...notification,
    ...(notification.screen_extra_data &&
      JSON.parse(notification.screen_extra_data)),
    ...iosData,
    ...(iosData &&
      iosData.screen_extra_data &&
      JSON.parse(iosData.screen_extra_data)),
  };

  return {
    screen: data.screen,
    person_id: data.person_id,
    organization_id: data.organization_id,
    celebration_item_id: data.celebration_item_id,
  } as {
    screen?: string;
    person_id?: string;
    organization_id?: string;
    celebration_item_id?: string;
  };
}

const setPushDevice = (token: string) => (
  dispatch: ThunkDispatch<{}, never, AnyAction>,
) => {
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

export const deletePushToken = (
  dispatch: ThunkDispatch<{}, never, AnyAction>,
  getState: () => { notifications: NotificationsState },
) => {
  const { pushDevice } = getState().notifications;
  if (!pushDevice) {
    return;
  }

  const query = {
    deviceId: pushDevice.id,
  };

  return dispatch(callApi(REQUESTS.DELETE_PUSH_TOKEN, query, {}));
};

/*export showWelcomeNotification() {
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
}*/
