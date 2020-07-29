/* eslint-disable max-lines */

import PushNotificationIOS from '@react-native-community/push-notification-ios';
// eslint-disable-next-line import/default
import PushNotification, {
  // eslint-disable-next-line import/named
  PushNotification as RNPushNotificationPayloadAndConstructor,
} from 'react-native-push-notification';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import {
  GCM_SENDER_ID,
  GLOBAL_COMMUNITY_ID,
  NOTIFICATION_PROMPT_TYPES,
  MAIN_TABS,
  COMMUNITIES_TAB,
} from '../constants';
import { ADD_PERSON_THEN_STEP_SCREEN_FLOW } from '../routes/constants';
import { isAndroid } from '../utils/common';
import { NOTIFICATION_PRIMER_SCREEN } from '../containers/NotificationPrimerScreen';
import { NOTIFICATION_OFF_SCREEN } from '../containers/NotificationOffScreen';
import { LOADING_SCREEN } from '../containers/LoadingScreen';
import { REQUESTS } from '../api/routes';
import { AuthState } from '../reducers/auth';
import { NotificationsState } from '../reducers/notifications';
import { COMMUNITY_TABS } from '../containers/Communities/Community/constants';
import { COMMUNITY_CHALLENGES } from '../containers/Groups/GroupChallenges';
import { RootState } from '../reducers';
import { rollbar } from '../utils/rollbar.config';
import { CHALLENGE_DETAIL_SCREEN } from '../containers/ChallengeDetailScreen';

import { refreshCommunity } from './organizations';
import { navToPersonScreen } from './person';
import { reloadGroupChallengeFeed } from './challenges';
import {
  navigatePush,
  navigateToMainTabs,
  navigateToFeedItemComments,
  navigateNestedReset,
} from './navigation';
import callApi from './api';
import { getCelebrateFeed } from './celebration';

export const SET_NOTIFICATION_ANALYTICS = 'app/SET_NOTIFICATION_ANALYTICS';

export interface SetNotificationAnalyticsAction {
  type: typeof SET_NOTIFICATION_ANALYTICS;
  notificationName: string;
}

const setNotificationAnalytics = (
  notificationName: string,
): SetNotificationAnalyticsAction => ({
  type: SET_NOTIFICATION_ANALYTICS,
  notificationName,
});

// react-native-push-notifications has the PushNotification type overloaded to be both the notification payload and the constructor so TS merges them. Here we just pick the payload keys.
export type RNPushNotificationPayload = Pick<
  RNPushNotificationPayloadAndConstructor,
  | 'foreground'
  | 'userInteraction'
  | 'message'
  | 'data'
  | 'subText'
  | 'badge'
  | 'alert'
  | 'sound'
  | 'finish'
>;

export type PushNotificationPayloadIosOrAndroid =
  | PushNotificationPayloadIos
  | PushNotificationPayloadAndroid;

export type PushNotificationPayloadIos = RNPushNotificationPayload & {
  data: {
    link: {
      data: PushNotificationPayloadData;
    };
  };
};

export type PushNotificationPayloadAndroid = RNPushNotificationPayload & {
  data: PushNotificationPayloadData;
};

export type PushNotificationPayloadData =
  | { screen: 'home' }
  | { screen: 'steps' }
  | { screen: 'person_steps'; person_id: string; organization_id?: string }
  | { screen: 'my_steps' }
  | { screen: 'add_a_person'; organization_id?: string }
  | { screen: 'celebrate_feed'; organization_id: string }
  | {
      screen: 'celebrate';
      organization_id: string;
      screen_extra_data: string | { celebration_item_id?: string };
    }
  | {
      screen: 'celebrate_item';
      organization_id: string;
      screen_extra_data: string | { celebration_item_id: string };
    }
  | {
      screen: 'community_challenges';
      organization_id: string | null;
      challenge_id: string;
    };

type ParsedNotificationData =
  | { screen: 'home' }
  | { screen: 'steps' }
  | { screen: 'person_steps'; person_id: string; organization_id?: string }
  | { screen: 'my_steps' }
  | { screen: 'add_a_person'; organization_id?: string }
  | { screen: 'celebrate_feed'; organization_id: string }
  | {
      screen: 'celebrate';
      organization_id: string;
      celebration_item_id?: string;
    }
  | {
      screen: 'celebrate_item';
      organization_id: string;
      celebration_item_id: string;
    }
  | {
      screen: 'community_challenges';
      organization_id: string | null;
      challenge_id: string;
    };

export const HAS_SHOWN_NOTIFICATION_PROMPT =
  'app/HAS_SHOWN_NOTIFICATION_PROMPT';

interface HasShownPromptAction {
  type: typeof HAS_SHOWN_NOTIFICATION_PROMPT;
}

export const hasShownPrompt = (): HasShownPromptAction => ({
  type: HAS_SHOWN_NOTIFICATION_PROMPT,
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
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  getState: () => { auth: AuthState; notifications: NotificationsState },
) => {
  const skipNotificationOff =
    notificationType === NOTIFICATION_PROMPT_TYPES.LOGIN;

  let nativePermissionsEnabled = false;
  const {
    auth: { token },
    notifications: { appHasShownPrompt },
  } = getState();

  //ONLY register if logged in
  if (token) {
    //if iOS, and notification prompt has not yet been shown,
    //navigate to NotificationPrimerScreen
    if (!isAndroid && !appHasShownPrompt) {
      return dispatch(
        navigatePush(NOTIFICATION_PRIMER_SCREEN, {
          notificationType,
          onComplete,
        }),
      );
    }

    //check Native Permissions status
    nativePermissionsEnabled = (await dispatch(requestNativePermissions()))
      .nativePermissionsEnabled;

    //if iOS, and user has previously accepted notifications, but Native Permissions are now off,
    //delete push token from API and Redux, then navigate to NotificationOffScreen
    if (!isAndroid && !nativePermissionsEnabled && !skipNotificationOff) {
      dispatch(deletePushToken());
      return dispatch(
        navigatePush(NOTIFICATION_OFF_SCREEN, {
          notificationType,
          onComplete,
        }),
      );
    }
  }

  //all other cases, return the result of the Native Permissions check
  //NOTE: Android does not need permissions from the user to enable notifications
  return (
    onComplete && onComplete({ nativePermissionsEnabled, showedPrompt: false })
  );
};

//RNPushNotification.requestPermissions() will do the following:
// - display the modal asking the user to enable notifications (first time only)
// - return current state of Native Notifications Permissions (we should update app state accordingly)
// - refreshes Push Device Token (this gets handled by onRegister() callback)
export const requestNativePermissions = () => async () => {
  const nativePermissions = await PushNotification.requestPermissions();

  const nativePermissionsEnabled = !!(
    nativePermissions && nativePermissions.alert
  );

  return { nativePermissionsEnabled };
};

export function configureNotificationHandler() {
  return (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => { notifications: NotificationsState },
  ) => {
    PushNotification.configure({
      onRegister(t) {
        const { pushDevice } = getState().notifications;

        if (pushDevice && pushDevice.token === t.token) {
          return;
        }
        //make api call to register token with user
        dispatch(setPushDevice(t.token));
      },

      async onNotification(notification) {
        await dispatch(
          handleNotification(
            notification as PushNotificationPayloadIosOrAndroid,
          ),
        );

        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // @ts-ignore onRegistrationError hasn't been added to @types/react-native-push-notification yet
      onRegistrationError: (error: Error) => {
        // eslint-disable-next-line no-console
        console.log(error.message, error);
        !__DEV__ && rollbar.error(error);
      },

      // ANDROID ONLY: GCM Sender ID
      senderID: GCM_SENDER_ID,

      // we manually call this after to have access to a promise for the iOS prompt
      requestPermissions: false,
    });
  };
}

function handleNotification(notification: PushNotificationPayloadIosOrAndroid) {
  return async (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => { auth: AuthState },
  ) => {
    if (isAndroid && !notification.userInteraction) {
      return;
    }

    const { person: me } = getState().auth;

    const notificationData = parseNotificationData(notification);

    dispatch(setNotificationAnalytics(notificationData.screen));

    switch (notificationData.screen) {
      case 'home':
      case 'steps':
        return dispatch(navigateToMainTabs());
      case 'person_steps': {
        const { person_id: personId } = notificationData;
        return dispatch(navToPersonScreen(personId));
      }
      case 'my_steps':
        return dispatch(navToPersonScreen(me.id));
      case 'add_a_person': {
        const { organization_id } = notificationData;
        return dispatch(
          navigatePush(ADD_PERSON_THEN_STEP_SCREEN_FLOW, {
            organization: { id: organization_id },
          }),
        );
      }
      case 'celebrate_feed': {
        const { organization_id } = notificationData;
        if (organization_id) {
          return dispatch(
            navigatePush(COMMUNITY_TABS, {
              communityId: organization_id,
            }),
          );
        }
        return;
      }
      // We intend to deprecate 'celebrate'. 'celebrate_item' should always have 'celebration_item_id' defined while the old celebrate required conditional logic  https://jira.cru.org/browse/MHP-3151
      case 'celebrate':
      case 'celebrate_item': {
        const { organization_id, celebration_item_id } = notificationData;

        if (!organization_id) {
          return;
        }
        if (!celebration_item_id) {
          return dispatch(
            navigatePush(COMMUNITY_TABS, {
              communityId: organization_id,
            }),
          );
        }

        dispatch(navigatePush(LOADING_SCREEN));
        try {
          dispatch(refreshCommunity(organization_id));
          await getCelebrateFeed(organization_id);
          return dispatch(
            navigateToFeedItemComments(celebration_item_id, organization_id),
          );
        } catch (error) {
          dispatch(navigateToMainTabs());
          throw error;
        }
      }
      case 'community_challenges': {
        const { organization_id, challenge_id } = notificationData;
        // IOS Global Community Challenges PN returns the organization_id as null
        const communityId =
          organization_id === null ? GLOBAL_COMMUNITY_ID : organization_id;
        await dispatch(refreshCommunity(communityId));
        await dispatch(reloadGroupChallengeFeed(communityId));
        return dispatch(
          navigateNestedReset([
            {
              routeName: MAIN_TABS,
              tabName: COMMUNITIES_TAB,
            },
            {
              routeName: COMMUNITY_TABS,
              params: { communityId },
              tabName: COMMUNITY_CHALLENGES,
            },
            {
              routeName: CHALLENGE_DETAIL_SCREEN,
              params: {
                challengeId: challenge_id,
                orgId: communityId,
                isAdmin: false,
              },
            },
          ]),
        );
      }
    }
  };
}

export function parseNotificationData(
  notification: PushNotificationPayloadIosOrAndroid,
): ParsedNotificationData {
  const isIosPayload = (
    notification: PushNotificationPayloadIosOrAndroid,
  ): notification is PushNotificationPayloadIos =>
    !!(notification as PushNotificationPayloadIos).data?.link;

  const payloadData = isIosPayload(notification)
    ? notification.data.link.data
    : notification.data;

  switch (payloadData.screen) {
    case 'celebrate':
    case 'celebrate_item': {
      const { screen_extra_data, ...mainData } = payloadData;
      return {
        ...mainData,
        ...(typeof screen_extra_data === 'string' && screen_extra_data !== ''
          ? JSON.parse(screen_extra_data)
          : screen_extra_data || {}),
      };
    }
    default:
      return payloadData;
  }
}

const setPushDevice = (token: string) => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) => {
  const data = {
    data: {
      type: 'push_notification_device_token',
      attributes: {
        token,
        platform: isAndroid ? 'GCM' : __DEV__ ? 'APNS_SANDBOX' : 'APNS',
      },
    },
  };
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  return dispatch<any>(callApi(REQUESTS.SET_PUSH_TOKEN, { include: '' }, data));
};

export const deletePushToken = () => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  getState: () => { notifications: NotificationsState },
) => {
  const { pushDevice } = getState().notifications;
  if (!pushDevice) {
    return;
  }

  const query = {
    deviceId: pushDevice.id,
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  return dispatch<any>(callApi(REQUESTS.DELETE_PUSH_TOKEN, query, {}));
};
