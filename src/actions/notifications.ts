/* eslint complexity: 0 */

import { PushNotificationIOS } from 'react-native';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import RNPushNotification, {
  PushNotification,
} from 'react-native-push-notification';
import Config from 'react-native-config';

import { GCM_SENDER_ID, NOTIFICATION_PROMPT_TYPES } from '../constants';
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

export const HAS_SHOWN_NOTIFICATION_PROMPT =
  'app/HAS_SHOWN_NOTIFICATION_PROMPT';
export const UPDATE_ACCEPTED_NOTIFICATIONS =
  'app/UPDATE_ACCEPTED_NOTIFICATIONS';

export interface HasShownPromptAction {
  type: typeof HAS_SHOWN_NOTIFICATION_PROMPT;
}

export interface UpdateAcceptedNotificationsAction {
  type: typeof UPDATE_ACCEPTED_NOTIFICATIONS;
  acceptedNotifications: boolean;
}

export const hasShownPrompt = (): HasShownPromptAction => ({
  type: HAS_SHOWN_NOTIFICATION_PROMPT,
});

export const updateAcceptedNotifications = (
  acceptedNotifications: boolean,
): UpdateAcceptedNotificationsAction => ({
  type: UPDATE_ACCEPTED_NOTIFICATIONS,
  acceptedNotifications,
});

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

export const checkNotifications = (
  notificationType: NOTIFICATION_PROMPT_TYPES,
  disableBack: boolean,
) => (
  dispatch: ThunkDispatch<{ notifications: NotificationsState }, {}, AnyAction>,
  getState: () => { auth: AuthState; notifications: NotificationsState },
) => {
  const {
    auth: { token },
    notifications: { appHasShownPrompt, userHasAcceptedNotifications },
  } = getState();

  //ONLY register if logged in
  if (token) {
    //Android does not need permission from user; re-register push device token
    if (isAndroid) {
      return dispatch(requestNativePermissions());
    }

    return new Promise<{ acceptedNotifications: boolean }>(resolve => {
      const onComplete = (acceptedNotifications: boolean) => {
        !disableBack && dispatch(navigateBack());
        resolve({ acceptedNotifications });
      };

      //IF iOS user has previously given permission, check that native permissions are still active
      if (userHasAcceptedNotifications) {
        return RNPushNotification.checkPermissions(permission => {
          //IF native iOS permissions are active, re-register push device token
          if (permission && permission.alert) {
            return resolve(dispatch(requestNativePermissions()));
          }

          //IF native iOS permissions are not active, alert user, then update API and local state
          dispatch(deletePushToken());
          dispatch(
            navigatePush(NOTIFICATION_OFF_SCREEN, {
              notificationType,
              onComplete,
            }),
          );
        });
      }

      //IF app has not already asked permissions from iOS user, ask them now
      if (!appHasShownPrompt) {
        return dispatch(
          navigatePush(NOTIFICATION_PRIMER_SCREEN, {
            notificationType,
            onComplete,
          }),
        );
      }
    });

    //IF app has already asked for permissions, and iOS user has declined, do nothing
  }
};

/*const showPromptAndAwaitReponse = (
  screen: typeof NOTIFICATION_PRIMER_SCREEN | typeof NOTIFICATION_OFF_SCREEN,
  notificationType: NOTIFICATION_PROMPT_TYPES,
  disableBack: boolean,
) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) =>
  new Promise(resolve => {
    const onComplete = (acceptedNotifications: boolean) => {
      !disableBack && dispatch(navigateBack());
      resolve({ acceptedNotifications });
    };

    dispatch(navigatePush(screen, { notificationType, onComplete }));
  });*/

export const requestNativePermissions = () => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch(hasShownPrompt());
  const permission = await RNPushNotification.requestPermissions();

  const acceptedNotifications = !!(permission && permission.alert);
  dispatch(updateAcceptedNotifications(acceptedNotifications));
  return { acceptedNotifications };
};

export const configureNotificationHandler = () => (
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
      await dispatch(handleNotification(notification));

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
      return dispatch(navToPersonScreen(me));
    case 'add_a_person':
      return dispatch(
        navigatePush(ADD_PERSON_THEN_STEP_SCREEN_FLOW, {
          organization: { id: organization_id },
        }),
      );
    case 'celebrate':
      if (organization_id) {
        const community = await dispatch(refreshCommunity(organization_id));
        await dispatch(reloadGroupCelebrateFeed(organization_id));
        return dispatch(
          navigateToCelebrateComments(community, celebration_item_id),
        );
      }
      return;
    case 'community_challenges':
      const community = await dispatch(refreshCommunity(organization_id));
      await dispatch(reloadGroupChallengeFeed(organization_id));
      return dispatch(navigateToCommunity(community, GROUP_CHALLENGES));
  }
};

export function parseNotificationData(notification: MHPushNotification) {
  const { data: { link: { data: iosData = {} } = {} } = {} } = notification;
  const data = {
    ...notification,
    ...(notification.screen_extra_data &&
      JSON.parse(notification.screen_extra_data)),
    ...iosData,
    ...(iosData.screen_extra_data && JSON.parse(iosData.screen_extra_data)),
  };

  return {
    screen: data.screen,
    person_id: data.person_id,
    organization_id: data.organization_id,
    celebration_item_id: data.celebration_item_id,
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

export const deletePushToken = () => (
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
