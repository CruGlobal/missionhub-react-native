/* eslint-disable @typescript-eslint/no-explicit-any, max-lines */

// eslint-disable-next-line import/default
import RNPushNotification, {
  // eslint-disable-next-line import/named
  PushNotificationPermissions,
} from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';
import { MockStore } from 'redux-mock-store';

import { createThunkStore } from '../../../testUtils';
import {
  checkNotifications,
  deletePushToken,
  configureNotificationHandler,
  requestNativePermissions,
  parseNotificationData,
  SET_NOTIFICATION_ANALYTICS,
  RNPushNotificationPayload,
  PushNotificationPayloadIosOrAndroid,
  PushNotificationPayloadAndroid,
  PushNotificationPayloadIos,
} from '../notifications';
import {
  LOAD_PERSON_DETAILS,
  GLOBAL_COMMUNITY_ID,
  NOTIFICATION_PROMPT_TYPES,
} from '../../constants';
import * as common from '../../utils/common';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { getPersonDetails, navToPersonScreen } from '../person';
import {
  navigatePush,
  navigateReset,
  navigateToMainTabs,
  navigateToFeedItemComments,
  navigateNestedReset,
} from '../navigation';
import { refreshCommunity } from '../organizations';
import { reloadGroupChallengeFeed } from '../challenges';
import { NOTIFICATION_OFF_SCREEN } from '../../containers/NotificationOffScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../../containers/NotificationPrimerScreen';
import { ADD_PERSON_THEN_STEP_SCREEN_FLOW } from '../../routes/constants';
import { getCelebrateFeed } from '../celebration';
import { COMMUNITY_TABS } from '../../containers/Communities/Community/constants';
import { isAuthenticated } from '../../auth/authStore';

jest.mock('../person');
jest.mock('../organizations');
jest.mock('../celebration');
jest.mock('../challenges');
jest.mock('../navigation');
jest.mock('../api');
jest.mock('react-native-config', () => ({
  GCM_SENDER_ID: 'Test GCM Sender ID',
  APNS_MODE: 'APNS',
}));
jest.mock('../../selectors/organizations');
jest.mock('../../auth/authStore');
jest.mock('../../auth/authUtilities', () => ({
  loadAuthPerson: jest.fn(() => ({ id: '1' })),
}));

const pushDevice = { id: '1' };
const permission: PushNotificationPermissions = { alert: true };

const callApiResult = { type: 'call API' };
const navigatePushResult = { type: 'nagivate push' };
const navigateResetResult = { type: 'navigate reset' };
const navigateToMainTabsResult = { type: 'navigateToMainTabs' };
const screen_extra_data = JSON.stringify({ celebration_item_id: '111' });

(navigateToMainTabs as jest.Mock).mockReturnValue(navigateToMainTabsResult);

const baseNotification: RNPushNotificationPayload = {
  foreground: true,
  userInteraction: true,
  message: '',
  data: {},
  subText: undefined,
  badge: 0,
  alert: {},
  sound: '',
  finish: () => {},
};

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
  (callApi as jest.Mock).mockReturnValue(callApiResult);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  (navigateNestedReset as jest.Mock).mockReturnValue({
    type: 'navigateNestedReset',
  });
  (navigateReset as jest.Mock).mockReturnValue(navigateResetResult);
  (RNPushNotification.requestPermissions as jest.Mock).mockReturnValue(
    permission,
  );
  (RNPushNotification.checkPermissions as jest.Mock).mockImplementation(cb =>
    cb(permission),
  );
});

describe('checkNotifications', () => {
  const notificationType = NOTIFICATION_PROMPT_TYPES.ONBOARDING;

  describe('no onComplete', () => {
    it('skips everything if not logged in', () => {
      (isAuthenticated as jest.Mock).mockReturnValue(false);
      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
        },
      });

      store.dispatch<any>(checkNotifications(notificationType));

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(RNPushNotification.requestPermissions).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([]);
    });

    it('immediately check permissions if Android', async () => {
      ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
      (isAuthenticated as jest.Mock).mockReturnValue(true);
      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
        },
      });

      await store.dispatch<any>(checkNotifications(notificationType));

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(RNPushNotification.checkPermissions).toHaveBeenCalled();
      expect(store.getActions()).toEqual([]);
    });

    it('requests permissions if iOS user has already approved and native permissions are enabled', async () => {
      (isAuthenticated as jest.Mock).mockReturnValue(true);
      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: true,
        },
      });

      await store.dispatch<any>(checkNotifications(notificationType));

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(RNPushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(store.getActions()).toEqual([]);
    });

    it('navigates to NotificationOffScreen if native permissions are disabled | IOS', async () => {
      (RNPushNotification.requestPermissions as jest.Mock).mockReturnValue({});
      (isAuthenticated as jest.Mock).mockReturnValue(true);

      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: true,
        },
      });

      await store.dispatch<any>(checkNotifications(notificationType));

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.DELETE_PUSH_TOKEN,
        { deviceId: pushDevice.id },
        {},
      );
      expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_OFF_SCREEN, {
        notificationType,
        onComplete: undefined,
      });
      expect(RNPushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(store.getActions()).toEqual([callApiResult, navigatePushResult]);
    });

    it('navigates to NotificationOffScreen if native permissions are disabled | Android', async () => {
      ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
      (isAuthenticated as jest.Mock).mockReturnValue(true);
      (RNPushNotification.checkPermissions as jest.Mock).mockImplementation(
        cb => cb({ alert: false }),
      );

      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: true,
        },
      });

      await store.dispatch<any>(checkNotifications(notificationType));

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.DELETE_PUSH_TOKEN,
        { deviceId: pushDevice.id },
        {},
      );
      expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_OFF_SCREEN, {
        notificationType,
        onComplete: undefined,
      });
      expect(RNPushNotification.checkPermissions).toHaveBeenCalled();
      expect(store.getActions()).toEqual([callApiResult, navigatePushResult]);
    });

    it('navigates to NotificationPrimerScreen if iOS user has not already approved and prompt has not been shown', async () => {
      (isAuthenticated as jest.Mock).mockReturnValue(true);
      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
        },
      });

      await store.dispatch<any>(checkNotifications(notificationType));

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_PRIMER_SCREEN, {
        notificationType,
        onComplete: undefined,
      });
      expect(RNPushNotification.requestPermissions).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([navigatePushResult]);
    });

    it('Does nothing if LOGIN and native permissions are disabled', async () => {
      (RNPushNotification.requestPermissions as jest.Mock).mockReturnValue({});
      (isAuthenticated as jest.Mock).mockReturnValue(true);

      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: true,
        },
      });

      await store.dispatch<any>(
        checkNotifications(NOTIFICATION_PROMPT_TYPES.LOGIN),
      );

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(RNPushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(store.getActions()).toEqual([]);
    });
  });

  describe('onComplete', () => {
    const onComplete = jest.fn();

    it('skips everything if not logged in', () => {
      (isAuthenticated as jest.Mock).mockReturnValue(false);
      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
        },
      });

      store.dispatch<any>(checkNotifications(notificationType, onComplete));

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(RNPushNotification.requestPermissions).not.toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalledWith({
        nativePermissionsEnabled: false,
        showedPrompt: false,
      });
      expect(store.getActions()).toEqual([]);
    });

    it('immediately check permissions if Android', async () => {
      ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
      (isAuthenticated as jest.Mock).mockReturnValue(true);
      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
        },
      });

      await store.dispatch<any>(
        checkNotifications(notificationType, onComplete),
      );

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(RNPushNotification.checkPermissions).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalledWith({
        nativePermissionsEnabled: true,
        showedPrompt: false,
      });
      expect(store.getActions()).toEqual([]);
    });

    it('requests permissions if iOS user has already approved and native permissions are enabled', async () => {
      (isAuthenticated as jest.Mock).mockReturnValue(true);
      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: true,
        },
      });

      await store.dispatch<any>(
        checkNotifications(notificationType, onComplete),
      );

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(RNPushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(onComplete).toHaveBeenCalledWith({
        nativePermissionsEnabled: true,
        showedPrompt: false,
      });
      expect(store.getActions()).toEqual([]);
    });

    it('navigates to NotificationOffScreen if native permissions are disabled', async () => {
      (isAuthenticated as jest.Mock).mockReturnValue(true);
      (RNPushNotification.requestPermissions as jest.Mock).mockReturnValue({});

      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: true,
        },
      });

      await store.dispatch<any>(
        checkNotifications(notificationType, onComplete),
      );

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.DELETE_PUSH_TOKEN,
        { deviceId: pushDevice.id },
        {},
      );
      expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_OFF_SCREEN, {
        notificationType,
        onComplete,
      });
      expect(RNPushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(onComplete).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([callApiResult, navigatePushResult]);
    });

    it('navigates to NotificationPrimerScreen if iOS user has not already approved and prompt has not been shown', async () => {
      (isAuthenticated as jest.Mock).mockReturnValue(true);
      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
        },
      });

      await store.dispatch<any>(
        checkNotifications(notificationType, onComplete),
      );

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_PRIMER_SCREEN, {
        notificationType,
        onComplete,
      });
      expect(RNPushNotification.requestPermissions).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([navigatePushResult]);
    });

    it('Does nothing if LOGIN and native permissions are disabled', async () => {
      (RNPushNotification.requestPermissions as jest.Mock).mockReturnValue({});
      (isAuthenticated as jest.Mock).mockReturnValue(true);

      const store = createThunkStore({
        notifications: {
          pushDevice,
          appHasShownPrompt: true,
        },
      });

      await store.dispatch<any>(
        checkNotifications(NOTIFICATION_PROMPT_TYPES.LOGIN, onComplete),
      );

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(RNPushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(store.getActions()).toEqual([]);
    });
  });
});

describe('configureNotificationHandler', () => {
  let store: MockStore;

  beforeEach(() => {
    store = createThunkStore({ notifications: { pushDevice } });
  });

  it('should configure notifications', () => {
    store.dispatch<any>(configureNotificationHandler());

    expect(RNPushNotification.configure).toHaveBeenCalledWith({
      onRegister: expect.any(Function),
      onNotification: expect.any(Function),
      onRegistrationError: expect.any(Function),
      requestPermissions: false,
    });
  });
});

describe('askNotificationPermissions', () => {
  beforeEach(() => {
    (RNPushNotification.requestPermissions as jest.Mock).mockReturnValue({
      alert: 1,
    });
    (navigateReset as jest.Mock).mockReturnValue(navigateResetResult);
  });

  describe('onRegister', () => {
    const oldToken = 'Old Token';
    const newToken = 'New Token';
    const store = createThunkStore({
      notifications: {
        pushDevice: {
          ...pushDevice,
          token: oldToken,
        },
      },
    });

    beforeEach(() => {
      (RNPushNotification.configure as jest.Mock).mockImplementation(config =>
        config.onRegister({ token: newToken }),
      );
      store.clearActions();
    });

    it('should update notification token for iOS devices', async () => {
      store.dispatch<any>(configureNotificationHandler());
      await store.dispatch<any>(requestNativePermissions());

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.SET_PUSH_TOKEN,
        { include: '' },
        {
          data: {
            type: 'push_notification_device_token',
            attributes: {
              token: newToken,
              platform: 'APNS_SANDBOX',
            },
          },
        },
      );
      expect(store.getActions()).toEqual([callApiResult]);
    });

    it('should update notification token for android devices', async () => {
      ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
      store.dispatch<any>(configureNotificationHandler());
      await store.dispatch<any>(requestNativePermissions());

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.SET_PUSH_TOKEN,
        { include: '' },
        {
          data: {
            type: 'push_notification_device_token',
            attributes: {
              token: newToken,
              platform: 'GCM',
            },
          },
        },
      );
      expect(store.getActions()).toEqual([callApiResult]);
    });

    it("should do nothing if the token hasn't changed", async () => {
      (RNPushNotification.configure as jest.Mock).mockImplementation(config =>
        config.onRegister({ token: oldToken }),
      );
      store.dispatch<any>(configureNotificationHandler());
      await store.dispatch<any>(requestNativePermissions());

      expect(callApi).not.toHaveBeenCalled();
    });
  });

  describe('onNotification', () => {
    const person = { id: '1', type: 'person' };
    const organization = { id: '234234' };
    const organizations = {
      someProp: 'hello, Roge',
    };
    const celebration_item_id = '111';

    const store = createThunkStore({
      organizations,
    });

    const finish = jest.fn();
    const navToPersonScreenResult = { type: 'navigated to person screen' };
    const refreshCommunityResult = organization;
    const reloadGroupChallengeFeedResult = { type: 'reload challenge feed' };
    const navToCelebrateResult = { type: 'navigated to celebrate comments' };

    beforeEach(() => {
      ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
      store.clearActions();
      (navToPersonScreen as jest.Mock).mockReturnValue(navToPersonScreenResult);
      (refreshCommunity as jest.Mock).mockReturnValue(
        () => refreshCommunityResult,
      );
      (reloadGroupChallengeFeed as jest.Mock).mockReturnValue(
        reloadGroupChallengeFeedResult,
      );
      (navigateToFeedItemComments as jest.Mock).mockReturnValue(
        navToCelebrateResult,
      );
      (navigateToMainTabs as jest.Mock).mockReturnValue(
        navigateToMainTabsResult,
      );
      (RNPushNotification.requestPermissions as jest.Mock).mockReturnValue({
        alert: 1,
      });
    });

    async function testNotification(
      notification: PushNotificationPayloadIosOrAndroid,
      userInteraction = true,
    ) {
      const deepLinkComplete = new Promise(resolve =>
        (RNPushNotification.configure as jest.Mock).mockImplementation(
          async config => {
            await store.dispatch<any>(requestNativePermissions());
            await config.onNotification({
              ...notification,
              userInteraction,
              finish,
            });
            resolve();
          },
        ),
      );
      store.dispatch<any>(configureNotificationHandler());
      await deepLinkComplete;
    }

    describe('userInteraction = false', () => {
      it('on iOS, should call iOS finish', async () => {
        await testNotification(
          { ...baseNotification, data: { screen: 'home' } },
          false,
        );

        expect(navigateToMainTabs).toHaveBeenCalled();
        expect(finish).toHaveBeenCalledWith(
          PushNotificationIOS.FetchResult.NoData,
        );
        expect(store.getActions()).toEqual([
          { type: SET_NOTIFICATION_ANALYTICS, notificationName: 'home' },
          navigateToMainTabsResult,
        ]);
      });

      it('on Android, should not navigate', async () => {
        ((common as unknown) as { isAndroid: boolean }).isAndroid = true;

        await testNotification({ ...baseNotification, screen: 'home' }, false);
        expect(store.getActions()).toEqual([]);
      });

      it('on Android, it should navigate if userInteraction is undefined', async () => {
        ((common as unknown) as { isAndroid: boolean }).isAndroid = true;

        await testNotification(
          { ...baseNotification, screen: 'home' },
          undefined,
        );

        expect(store.getActions()).toEqual([
          { type: SET_NOTIFICATION_ANALYTICS, notificationName: 'home' },
          navigateToMainTabsResult,
        ]);
      });
    });

    it('should deep link to home screen', async () => {
      await testNotification({ ...baseNotification, data: { screen: 'home' } });

      expect(navigateToMainTabs).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        { type: SET_NOTIFICATION_ANALYTICS, notificationName: 'home' },
        navigateToMainTabsResult,
      ]);
    });

    it('should deep link to main steps tab screen', async () => {
      await testNotification({
        ...baseNotification,
        data: { screen: 'steps' },
      });

      expect(navigateToMainTabs).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        { type: SET_NOTIFICATION_ANALYTICS, notificationName: 'steps' },
        navigateToMainTabsResult,
      ]);
    });

    it('should deep link to contact screen', async () => {
      await testNotification({
        ...baseNotification,
        data: {
          screen: 'person_steps',
          person_id: '1',
          organization_id: '2',
        },
      });

      expect(navToPersonScreen).toHaveBeenCalledWith(person.id);
      expect(store.getActions()).toEqual([
        { type: SET_NOTIFICATION_ANALYTICS, notificationName: 'person_steps' },
        navToPersonScreenResult,
      ]);
    });

    it('should deep link to contact screen on iOS', async () => {
      (getPersonDetails as jest.Mock).mockReturnValue({
        type: LOAD_PERSON_DETAILS,
        person,
      });
      await testNotification({
        ...baseNotification,
        data: {
          link: {
            data: {
              screen: 'person_steps',
              person_id: '1',
              organization_id: '2',
            },
          },
        },
      });

      expect(navToPersonScreen).toHaveBeenCalledWith(person.id);
      expect(store.getActions()).toEqual([
        { type: SET_NOTIFICATION_ANALYTICS, notificationName: 'person_steps' },
        navToPersonScreenResult,
      ]);
    });

    it("should deep link to ME user's contact screen", async () => {
      await testNotification({
        ...baseNotification,
        data: { screen: 'my_steps' },
      });

      expect(navToPersonScreen).toHaveBeenCalledWith(person.id);
      expect(store.getActions()).toEqual([
        { type: SET_NOTIFICATION_ANALYTICS, notificationName: 'my_steps' },
        navToPersonScreenResult,
      ]);
    });

    it('should deep link to add contact screen', async () => {
      (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);

      await testNotification({
        ...baseNotification,
        data: {
          screen: 'add_a_person',
          organization_id: organization.id,
        },
      });

      expect(navigatePush).toHaveBeenCalledWith(
        ADD_PERSON_THEN_STEP_SCREEN_FLOW,
        {
          organization,
        },
      );
      expect(store.getActions()).toEqual([
        { type: SET_NOTIFICATION_ANALYTICS, notificationName: 'add_a_person' },
        navigatePushResult,
      ]);
    });

    describe('parseNotificationData', () => {
      const notification = {
        ...baseNotification,
        data: {
          screen: 'celebrate',
          organization_id: organization.id,
          screen_extra_data,
        },
      } as PushNotificationPayloadAndroid;

      const iosNotification = {
        ...baseNotification,
        data: {
          link: {
            data: {
              screen: 'celebrate',
              organization_id: organization.id,
              screen_extra_data,
            },
          },
        },
      } as PushNotificationPayloadIos;

      it('should parse the notification data', () => {
        const parsedData = parseNotificationData(notification);
        expect(parsedData).toMatchObject({
          screen: 'celebrate',
          organization_id: '234234',
          celebration_item_id,
        });
      });
      it('Should parse iosNotification correctly', () => {
        const iosParsedData = parseNotificationData(iosNotification);
        expect(iosParsedData).toEqual({
          screen: 'celebrate',
          person_id: undefined,
          organization_id: '234234',
          celebration_item_id,
        });
      });
    });

    describe('celebrate_feed', () => {
      it('should navigate to community celebrate feed', async () => {
        await testNotification({
          ...baseNotification,
          data: {
            screen: 'celebrate_feed',
            organization_id: organization.id,
          },
        });

        expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_TABS, {
          communityId: organization.id,
        });
      });
      it('should navigate to global community feed if no organization_id', async () => {
        await testNotification({
          ...baseNotification,
          data: {
            screen: 'celebrate_feed',
            organization_id: undefined,
          },
        });

        expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_TABS, {
          communityId: GLOBAL_COMMUNITY_ID,
        });
      });
    });

    describe('celebrate_item', () => {
      it('should navigate to FEED_ITEM_DETAIL_SCREEN', async () => {
        await testNotification({
          ...baseNotification,
          data: {
            screen: 'celebrate_item',
            organization_id: organization.id,
            screen_extra_data,
          },
        });

        expect(refreshCommunity).toHaveBeenCalledWith(organization.id);
        expect(navigateToFeedItemComments).toHaveBeenCalledWith(
          celebration_item_id,
          organization.id,
        );
      });
      it('should navigate to global community if no organization_id', async () => {
        await testNotification({
          ...baseNotification,
          data: {
            screen: 'celebrate_item',
            organization_id: undefined,
            screen_extra_data,
          },
        });

        expect(refreshCommunity).toHaveBeenCalled();
        expect(navigateToFeedItemComments).toHaveBeenCalledWith(
          celebration_item_id,
          GLOBAL_COMMUNITY_ID,
        );
      });
      it('should navigate to COMMUNITY_TABS if no celebrate_item_id', async () => {
        await testNotification({
          ...baseNotification,
          data: {
            screen: 'celebrate_item',
            organization_id: organization.id,
            screen_extra_data: { celebration_item_id: '' },
          },
        });

        expect(refreshCommunity).not.toHaveBeenCalled();
        expect(getCelebrateFeed).not.toHaveBeenCalledWith();
        expect(navigateToFeedItemComments).not.toHaveBeenCalled();
        expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_TABS, {
          communityId: organization.id,
        });
      });
    });

    describe('celebrate', () => {
      it('should look for stored org', async () => {
        await testNotification({
          ...baseNotification,
          data: {
            screen: 'celebrate',
            organization_id: organization.id,
            screen_extra_data,
          },
        });

        expect(refreshCommunity).toHaveBeenCalledWith(organization.id);
        expect(navigateToFeedItemComments).toHaveBeenCalledWith(
          celebration_item_id,
          organization.id,
        );
      });

      it('should navigate to global community if no organization_id', async () => {
        await testNotification({
          ...baseNotification,
          data: {
            screen: 'celebrate',
            organization_id: undefined,
            screen_extra_data,
          },
        });

        expect(refreshCommunity).toHaveBeenCalled();
        expect(navigateToFeedItemComments).toHaveBeenCalledWith(
          celebration_item_id,
          GLOBAL_COMMUNITY_ID,
        );
      });
    });

    describe('community_challenges', () => {
      it('should look for stored org', async () => {
        await testNotification({
          ...baseNotification,
          data: {
            screen: 'community_challenges',
            organization_id: organization.id,
            challenge_id: '1',
          },
        });

        expect(refreshCommunity).toHaveBeenCalledWith(organization.id);
        expect(reloadGroupChallengeFeed).toHaveBeenCalledWith(organization.id);
        expect((navigateNestedReset as jest.Mock).mock.calls[0])
          .toMatchInlineSnapshot(`
          Array [
            Array [
              Object {
                "routeName": "nav/MAIN_TABS",
                "tabName": "CommunitiesTab",
              },
              Object {
                "params": Object {
                  "communityId": "234234",
                },
                "routeName": "nav/COMMUNITY_TABS",
                "tabName": "nav/COMMUNITY_CHALLENGES",
              },
              Object {
                "params": Object {
                  "challengeId": "1",
                  "isAdmin": false,
                  "orgId": "234234",
                },
                "routeName": "nav/CHALLENGE_DETAIL",
              },
            ],
          ]
        `);
      });

      it('should navigate to global community if no id passed', async () => {
        const global_community = { id: GLOBAL_COMMUNITY_ID };
        (refreshCommunity as jest.Mock).mockReturnValue(() => global_community);
        await testNotification({
          ...baseNotification,
          data: {
            screen: 'community_challenges',
            organization_id: null,
            challenge_id: '1',
          },
        });
        expect(refreshCommunity).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
        expect(reloadGroupChallengeFeed).toHaveBeenCalledWith(
          GLOBAL_COMMUNITY_ID,
        );
        expect((navigateNestedReset as jest.Mock).mock.calls[0])
          .toMatchInlineSnapshot(`
          Array [
            Array [
              Object {
                "routeName": "nav/MAIN_TABS",
                "tabName": "CommunitiesTab",
              },
              Object {
                "params": Object {
                  "communityId": "_global_community_id",
                },
                "routeName": "nav/COMMUNITY_TABS",
                "tabName": "nav/COMMUNITY_CHALLENGES",
              },
              Object {
                "params": Object {
                  "challengeId": "1",
                  "isAdmin": false,
                  "orgId": "_global_community_id",
                },
                "routeName": "nav/CHALLENGE_DETAIL",
              },
            ],
          ]
        `);
      });
    });
  });
});

describe('deletePushToken', () => {
  it('should not make an api request if there is nothing to delete', () => {
    const store = createThunkStore({
      notifications: {
        pushDevice: null,
      },
    });

    store.dispatch<any>(deletePushToken());

    expect(callApi).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
  it('should delete the push notification device token', () => {
    const store = createThunkStore({
      notifications: {
        pushDevice: {
          id: '1',
        },
      },
    });
    (callApi as jest.Mock).mockReturnValue({
      type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS,
    });

    store.dispatch<any>(deletePushToken());

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.DELETE_PUSH_TOKEN,
      { deviceId: '1' },
      {},
    );
    expect(store.getActions()).toEqual([
      { type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS },
    ]);
  });
});
