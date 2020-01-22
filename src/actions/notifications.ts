/* eslint complexity: 0 */

import { PushNotificationIOS } from 'react-native';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import RNPushNotification, {
  PushNotification,
} from 'react-native-push-notification';

import { GCM_SENDER_ID, NOTIFICATION_PROMPT_TYPES } from '../constants';
import { ADD_PERSON_THEN_STEP_SCREEN_FLOW } from '../routes/constants';
import { isAndroid } from '../utils/common';
import { NOTIFICATION_PRIMER_SCREEN } from '../containers/NotificationPrimerScreen';
import { NOTIFICATION_OFF_SCREEN } from '../containers/NotificationOffScreen';
import { GROUP_CHALLENGES } from '../containers/Groups/GroupScreen';
import { REQUESTS } from '../api/routes';
import { NotificationsState } from '../reducers/notifications';
import { AuthState } from '../reducers/auth';
import { OrganizationsState } from '../reducers/organizations';

import { refreshCommunity } from './organizations';
import { getPersonDetails, navToPersonScreen } from './person';
import { reloadGroupChallengeFeed } from './challenges';
import { reloadGroupCelebrateFeed } from './celebration';
import {
  navigatePush,
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
        person_id?: string;
        organization_id?: string;
        celebration_item_id?: string;
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

export const checkNotifications = (
  notificationType: NOTIFICATION_PROMPT_TYPES,
  onComplete?: ({
    nativePermissionsEnabled,
    showedPrompt,
  }: {
    nativePermissionsEnabled: boolean;
    showedPrompt: boolean;
  }) => void,
) => async (
  dispatch: ThunkDispatch<{ notifications: NotificationsState }, {}, AnyAction>,
  getState: () => { auth: AuthState; notifications: NotificationsState },
) => {
  console.log('start');
  const {
    auth: { token },
    notifications: { appHasShownPrompt, userHasAcceptedNotifications },
  } = getState();

  //ONLY register if logged in
  if (token) {
    //if iOS, and notification prompt has not yet been shown,
    //navigate to NotificationPrimerScreen
    if (!isAndroid && !appHasShownPrompt) {
      console.log(
        `Scenario: iOS=${!isAndroid} + hasShowedPrompt=${appHasShownPrompt}`,
      );

      return dispatch(
        navigatePush(NOTIFICATION_PRIMER_SCREEN, {
          notificationType,
          onComplete,
        }),
      );
    }

    //check Native Permissions status
    const { nativePermissionsEnabled } = await dispatch(
      requestNativePermissions(),
    );

    console.log(
      `Scenario: iOS=${!isAndroid} + hasShowedPrompt=${appHasShownPrompt} + userHasAccepted=${userHasAcceptedNotifications} + nativePermissions=${nativePermissionsEnabled}`,
    );

    //if iOS, and user has previously accepted notifications, but Native Permissions are now off,
    //navigate to NotificationOffScreen
    if (
      !isAndroid &&
      userHasAcceptedNotifications &&
      !nativePermissionsEnabled
    ) {
      return dispatch(
        navigatePush(NOTIFICATION_OFF_SCREEN, {
          notificationType,
          onComplete,
        }),
      );
    }

    //all other cases, return the result fo the Native Permissions check
    //NOTE: Android does not need permissions from the user to enable notifications
    console.log(
      `COMPLETE: nativePermissions=${nativePermissionsEnabled} + showedPrompt=false`,
    );
    return (
      onComplete &&
      onComplete({ nativePermissionsEnabled, showedPrompt: false })
    );
  }
};

//RNPushNotification.requestPermissions() will do the following:
// - display the modal asking the user to enable notifications (first time only)
// - return current state of Native Notifications Permissions (we should update app state accordingly)
// - refreshes Push Device Token (this gets handled by onRegister() callback)
export const requestNativePermissions = () => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  console.log('requestPermissions()');
  const nativePermissions = await RNPushNotification.requestPermissions();

  const nativePermissionsEnabled = !!(
    nativePermissions && nativePermissions.alert
  );
  console.log(
    `nativePermissions=${nativePermissionsEnabled}, updating API/Redux`,
  );
  dispatch(updateAcceptedNotifications(nativePermissionsEnabled));
  return { nativePermissionsEnabled };
};

export const configureNotificationHandler = () => (
  dispatch: ThunkDispatch<{ auth: AuthState }, {}, AnyAction>,
  getState: () => { notifications: NotificationsState },
) => {
  RNPushNotification.configure({
    onRegister(t) {
      console.log('new Push Device Token');
      const { pushDevice } = getState().notifications;

      if (pushDevice && pushDevice.token === t.token) {
        console.log('same as before, skip');
        return;
      }
      //make api call to register token with user
      dispatch(setPushDevice(t.token));
    },
    async onNotification(notification) {
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
  dispatch: ThunkDispatch<
    { organizations: OrganizationsState },
    null,
    AnyAction
  >,
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
          celebration_item_id
            ? navigateToCelebrateComments(community, celebration_item_id)
            : navigateToCommunity(community),
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
  const {
    data: { link: { data: iosData = { screen_extra_data: '' } } = {} } = {},
  } = notification;

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
  } as {
    screen: string;
    person_id?: string;
    organization_id?: string;
    celebration_item_id?: string;
  };

  return {
    screen: data.screen,
    person_id: data.person_id,
    organization_id: data.organization_id,
    celebration_item_id: data.celebration_item_id,
  };
}

const setPushDevice = (token: string) => (
  dispatch: ThunkDispatch<{}, null, AnyAction>,
) => {
  console.log('Set Push Device Token');
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

export const deletePushToken = () => (
  dispatch: ThunkDispatch<{}, never, AnyAction>,
  getState: () => { notifications: NotificationsState },
) => {
  console.log('Delete Push Device Token');
  const { pushDevice } = getState().notifications;
  if (!pushDevice) {
    return;
  }

  const query = {
    deviceId: pushDevice.id,
  };

  return dispatch(callApi(REQUESTS.DELETE_PUSH_TOKEN, query, {}));
};
