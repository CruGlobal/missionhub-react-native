/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint max-lines: 0 */

import { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';
import PushNotification, {
  PushNotificationPermissions,
} from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';

import {
  checkNotifications,
  deletePushToken,
  configureNotificationHandler,
  requestNativePermissions,
  parseNotificationData,
  UPDATE_ACCEPTED_NOTIFICATIONS,
  PushNotificationPayloadIos,
  PushNotificationPayloadIosOrAndroid,
} from '../notifications';
import {
  GCM_SENDER_ID,
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
  navigateToCommunity,
  navigateToCelebrateComments,
} from '../navigation';
import { refreshCommunity } from '../organizations';
import { reloadGroupChallengeFeed } from '../challenges';
import { NOTIFICATION_OFF_SCREEN } from '../../containers/NotificationOffScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../../containers/NotificationPrimerScreen';
import { GROUP_CHALLENGES } from '../../containers/Groups/GroupScreen';
import { ADD_PERSON_THEN_STEP_SCREEN_FLOW } from '../../routes/constants';
import { getCelebrateFeed } from '../celebration';
import { createThunkStore } from '../../../testUtils';

jest.mock('../person');
jest.mock('../organizations');
jest.mock('../celebration');
jest.mock('../challenges');
jest.mock('../navigation');
jest.mock('../api');
jest.mock('react-native-push-notification');
jest.mock('react-native-config', () => ({
  GCM_SENDER_ID: 'Test GCM Sender ID',
  APNS_MODE: 'APNS',
}));
jest.mock('../../selectors/organizations');

const authToken = 'auth token';
const pushDevice = { id: '1' };
const permission: PushNotificationPermissions = { alert: true };

const callApiResult = { type: 'call api' };
const navigatePushResult = { type: 'nagivate push' };
const navigateResetResult = { type: 'navigate reset' };
const navigateToMainTabsResult = { type: 'navigateToMainTabs' };
const screen_extra_data = JSON.stringify({ celebration_item_id: '111' });

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
  (callApi as jest.Mock).mockReturnValue(callApiResult);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  (navigateReset as jest.Mock).mockReturnValue(navigateResetResult);
  (PushNotification.requestPermissions as jest.Mock).mockReturnValue(
    permission,
  );
});

describe('checkNotifications', () => {
  const notificationType = NOTIFICATION_PROMPT_TYPES.ONBOARDING;

  describe('no onComplete', () => {
    it('skips everything if not logged in', () => {
      const store = createThunkStore({
        auth: { token: undefined },
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
          userHasAcceptedNotifications: true,
        },
      });

      store.dispatch<any>(checkNotifications(notificationType));

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(PushNotification.requestPermissions).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([]);
    });

    it('immediately requests permissions if Android', async () => {
      ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
      const store = createThunkStore({
        auth: { token: authToken },
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
          userHasAcceptedNotifications: true,
        },
      });

      await store.dispatch<any>(checkNotifications(notificationType));

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(PushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
      ]);
    });

    it('requests permissions if iOS user has already approved and native permissions are enabled', async () => {
      const store = createThunkStore({
        auth: { token: authToken },
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
          userHasAcceptedNotifications: true,
        },
      });

      await store.dispatch<any>(checkNotifications(notificationType));

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(PushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
      ]);
    });

    it('navigates to NotificationOffScreen if iOS user has already approved but native permissions are disabled', async () => {
      (PushNotification.requestPermissions as jest.Mock).mockReturnValue({});

      const store = createThunkStore({
        auth: { token: authToken },
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
          userHasAcceptedNotifications: true,
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
      expect(PushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: false },
        callApiResult,
        navigatePushResult,
      ]);
    });

    it('navigates to NotificationPrimerScreen if iOS user has not already approved and prompt has not been shown', async () => {
      const store = createThunkStore({
        auth: { token: authToken },
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
          userHasAcceptedNotifications: false,
        },
      });

      await store.dispatch<any>(checkNotifications(notificationType));

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_PRIMER_SCREEN, {
        notificationType,
        onComplete: undefined,
      });
      expect(PushNotification.requestPermissions).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([navigatePushResult]);
    });

    it('does nothing if iOS user has not already approved but prompt has already been shown', async () => {
      const store = createThunkStore({
        auth: { token: authToken },
        notifications: {
          pushDevice,
          appHasShownPrompt: true,
          userHasAcceptedNotifications: false,
        },
      });

      await store.dispatch<any>(checkNotifications(notificationType));

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(PushNotification.requestPermissions).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([]);
    });
  });

  describe('onComplete', () => {
    const onComplete = jest.fn();

    it('skips everything if not logged in', () => {
      const store = createThunkStore({
        auth: { token: undefined },
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
          userHasAcceptedNotifications: true,
        },
      });

      store.dispatch<any>(checkNotifications(notificationType, onComplete));

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(PushNotification.requestPermissions).not.toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalledWith({
        acceptedNotifications: false,
        showedPrompt: false,
      });
      expect(store.getActions()).toEqual([]);
    });

    it('immediately requests permissions if Android', async () => {
      ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
      const store = createThunkStore({
        auth: { token: authToken },
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
          userHasAcceptedNotifications: true,
        },
      });

      await store.dispatch<any>(
        checkNotifications(notificationType, onComplete),
      );

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(PushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(onComplete).toHaveBeenCalledWith({
        acceptedNotifications: true,
        showedPrompt: false,
      });
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
      ]);
    });

    it('requests permissions if iOS user has already approved and native permissions are enabled', async () => {
      const store = createThunkStore({
        auth: { token: authToken },
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
          userHasAcceptedNotifications: true,
        },
      });

      await store.dispatch<any>(
        checkNotifications(notificationType, onComplete),
      );

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(PushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(onComplete).toHaveBeenCalledWith({
        acceptedNotifications: true,
        showedPrompt: false,
      });
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
      ]);
    });

    it('navigates to NotificationOffScreen if iOS user has already approved but native permissions are disabled', async () => {
      (PushNotification.requestPermissions as jest.Mock).mockReturnValue({});

      const store = createThunkStore({
        auth: { token: authToken },
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
          userHasAcceptedNotifications: true,
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
      expect(PushNotification.requestPermissions).toHaveBeenCalledWith();
      expect(onComplete).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: false },
        callApiResult,
        navigatePushResult,
      ]);
    });

    it('navigates to NotificationPrimerScreen if iOS user has not already approved and prompt has not been shown', async () => {
      const store = createThunkStore({
        auth: { token: authToken },
        notifications: {
          pushDevice,
          appHasShownPrompt: false,
          userHasAcceptedNotifications: false,
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
      expect(PushNotification.requestPermissions).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([navigatePushResult]);
    });

    it('does nothing if iOS user has not already approved but prompt has already been shown', async () => {
      const store = createThunkStore({
        auth: { token: authToken },
        notifications: {
          pushDevice,
          appHasShownPrompt: true,
          userHasAcceptedNotifications: false,
        },
      });

      await store.dispatch<any>(
        checkNotifications(notificationType, onComplete),
      );

      expect(callApi).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalledWith({
        acceptedNotifications: false,
        showedPrompt: false,
      });
      expect(PushNotification.requestPermissions).not.toHaveBeenCalled();
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

    expect(PushNotification.configure).toHaveBeenCalledWith({
      onRegister: expect.any(Function),
      onNotification: expect.any(Function),
      senderID: GCM_SENDER_ID,
      requestPermissions: false,
    });
  });
});

describe('askNotificationPermissions', () => {
  beforeEach(() => {
    (PushNotification.requestPermissions as jest.Mock).mockReturnValue({
      alert: 1,
    });
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
      (PushNotification.configure as jest.Mock).mockImplementation(config =>
        config.onRegister({ token: newToken }),
      );
      (callApi as jest.Mock).mockReturnValue({
        type: REQUESTS.SET_PUSH_TOKEN.SUCCESS,
      });
      store.clearActions();
    });

    it('should update notification token for iOS devices', async () => {
      store.dispatch<any>(configureNotificationHandler());
      await store.dispatch<any>(requestNativePermissions());

      expect((callApi as jest.Mock).mock.calls).toMatchSnapshot();
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should update notification token for android devices', async () => {
      ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
      store.dispatch<any>(configureNotificationHandler());
      await store.dispatch<any>(requestNativePermissions());

      expect((callApi as jest.Mock).mock.calls).toMatchSnapshot();
      expect(store.getActions()).toMatchSnapshot();
    });

    it("should do nothing if the token hasn't changed", async () => {
      (PushNotification.configure as jest.Mock).mockImplementation(config =>
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
      auth: {
        isJean: true,
        person,
      },
      organizations,
    });

    const finish = jest.fn();
    const getPersonResult = { type: LOAD_PERSON_DETAILS, person };
    const navToPersonScreenResult = { type: 'navigated to person screen' };
    const refreshCommunityResult = organization;
    const reloadGroupChallengeFeedResult = { type: 'reload challenge feed' };
    const navToCelebrateResult = { type: 'navigated to celebrate comments' };
    const navToCommunityResult = { type: 'navigated to community' };

    beforeEach(() => {
      ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
      store.clearActions();
      (getPersonDetails as jest.Mock).mockReturnValue(getPersonResult);
      (navToPersonScreen as jest.Mock).mockReturnValue(navToPersonScreenResult);
      (refreshCommunity as jest.Mock).mockReturnValue(
        () => refreshCommunityResult,
      );
      (reloadGroupChallengeFeed as jest.Mock).mockReturnValue(
        reloadGroupChallengeFeedResult,
      );
      (navigateToCelebrateComments as jest.Mock).mockReturnValue(
        navToCelebrateResult,
      );
      (navigateToCommunity as jest.Mock).mockReturnValue(navToCommunityResult);
      (navigateToMainTabs as jest.Mock).mockReturnValue(
        navigateToMainTabsResult,
      );
      (PushNotification.requestPermissions as jest.Mock).mockReturnValue({
        alert: 1,
      });
    });

    async function testNotification(
      notification: PushNotificationPayloadIosOrAndroid,
      userInteraction = true,
    ) {
      const deepLinkComplete = new Promise(resolve =>
        (PushNotification.configure as jest.Mock).mockImplementation(
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
        ((common as unknown) as { isAndroid: boolean }).isAndroid = false;

        await testNotification({ screen: 'home' }, false);

        expect(navigateToMainTabs).toHaveBeenCalled();
        expect(finish).toHaveBeenCalledWith(
          PushNotificationIOS.FetchResult.NoData,
        );
        expect(store.getActions()).toEqual([
          { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
          navigateToMainTabsResult,
        ]);
      });

      it('on Android, should do nothing', async () => {
        ((common as unknown) as { isAndroid: boolean }).isAndroid = true;

        await testNotification({ screen: 'home' }, false);

        expect(store.getActions()).toEqual([
          { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
        ]);
      });
    });

    it('should deep link to home screen', async () => {
      await testNotification({ screen: 'home' });

      expect(navigateToMainTabs).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
        navigateToMainTabsResult,
      ]);
    });

    it('should deep link to main steps tab screen', async () => {
      await testNotification({ screen: 'steps' });

      expect(navigateToMainTabs).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
        navigateToMainTabsResult,
      ]);
    });

    it('should deep link to contact screen', async () => {
      await testNotification({
        screen: 'person_steps',
        person_id: '1',
        organization_id: '2',
      });

      expect(getPersonDetails).toHaveBeenCalledWith('1', '2');
      expect(navToPersonScreen).toHaveBeenCalledWith(person, { id: '2' });
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
        getPersonResult,
        navToPersonScreenResult,
      ]);
    });

    it('should deep link to contact screen on iOS', async () => {
      (getPersonDetails as jest.Mock).mockReturnValue({
        type: LOAD_PERSON_DETAILS,
        person,
      });

      // @ts-ignore
      getPersonDetails.mockReturnValue({ type: LOAD_PERSON_DETAILS, person });
      await testNotification({
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

      expect(getPersonDetails).toHaveBeenCalledWith('1', '2');
      expect(navToPersonScreen).toHaveBeenCalledWith(person, { id: '2' });
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
        getPersonResult,
        navToPersonScreenResult,
      ]);
    });

    it("should deep link to ME user's contact screen", async () => {
      await testNotification({ screen: 'my_steps' });

      expect(navToPersonScreen).toHaveBeenCalledWith(person);
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
        navToPersonScreenResult,
      ]);
    });

    it('should deep link to add contact screen', async () => {
      (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);

      await testNotification({
        screen: 'add_a_person',
        person_id: '1',
        organization_id: organization.id,
      });

      expect(navigatePush).toHaveBeenCalledWith(
        ADD_PERSON_THEN_STEP_SCREEN_FLOW,
        {
          organization,
        },
      );
      expect(store.getActions()).toEqual([
        { type: UPDATE_ACCEPTED_NOTIFICATIONS, acceptedNotifications: true },
        navigatePushResult,
      ]);
    });

    describe('parseNotificationData', () => {
      const notification: PushNotificationPayloadIosOrAndroid = {
        screen: 'celebrate',
        organization_id: organization.id,
        screen_extra_data,
      };

      const iosNotification: PushNotificationPayloadIos = {
        data: {
          link: {
            data: {
              screen: 'celebrate',
              organization_id: organization.id,
              screen_extra_data,
            },
          },
        },
      };

      it('should parse the notification data', () => {
        const parsedData = parseNotificationData(notification);
        expect(parsedData).toEqual({
          screen: 'celebrate',
          person_id: undefined,
          organization_id: '234234',
          celebration_item_id: '111',
        });
      });
      it('Should parse iosNotification correctly', () => {
        const iosParsedData = parseNotificationData(iosNotification);
        expect(iosParsedData).toEqual({
          screen: 'celebrate',
          person_id: undefined,
          organization_id: '234234',
          celebration_item_id: '111',
        });
      });
    });

    describe('celebrate_feed', () => {
      it('should navigate to community celebrate feed', async () => {
        await testNotification({
          screen: 'celebrate_feed',
          organization_id: organization.id,
          screen_extra_data: {
            celebration_item_id: undefined,
          },
        });

        expect(refreshCommunity).toHaveBeenCalledWith(organization.id);
        expect(navigateToCommunity).toHaveBeenCalledWith(organization);
      });
      it('should not navigate if no organization_id', async () => {
        await testNotification({
          screen: 'celebrate_feed',
          organization_id: undefined,
          screen_extra_data: {
            celebration_item_id: undefined,
          },
        });

        expect(refreshCommunity).not.toHaveBeenCalled();
        expect(navigateToCommunity).not.toHaveBeenCalled();
      });
    });

    describe('celebrate_item', () => {
      it('should navigate to CELEBRATION_DETAIL_SCREEN', async () => {
        await testNotification({
          screen: 'celebrate_item',
          organization_id: organization.id,
          screen_extra_data,
        });

        expect(refreshCommunity).toHaveBeenCalledWith(organization.id);
        expect(navigateToCelebrateComments).toHaveBeenCalledWith(
          organization,
          celebration_item_id,
        );
      });
      it('should not navigate if no organization_id', async () => {
        await testNotification({
          screen: 'celebrate_item',
          organization_id: undefined,
          screen_extra_data,
        });

        expect(refreshCommunity).not.toHaveBeenCalled();
        expect(navigateToCelebrateComments).not.toHaveBeenCalled();
      });
    });

    describe('celebrate', () => {
      it('should look for stored org', async () => {
        await testNotification({
          screen: 'celebrate',
          organization_id: organization.id,
          screen_extra_data,
        });

        expect(refreshCommunity).toHaveBeenCalledWith(organization.id);
        expect(getCelebrateFeed).toHaveBeenCalledWith(organization.id);
        expect(navigateToCelebrateComments).toHaveBeenCalledWith(
          organization,
          celebration_item_id,
        );
      });

      it('should not navigate to org if no id passed', async () => {
        await testNotification({
          screen: 'celebrate',
          organization_id: undefined,
          screen_extra_data,
        });

        expect(refreshCommunity).not.toHaveBeenCalled();
        expect(getCelebrateFeed).not.toHaveBeenCalled();
        expect(navigateToCelebrateComments).not.toHaveBeenCalled();
      });
    });

    describe('community_challenges', () => {
      it('should look for stored org', async () => {
        await testNotification({
          screen: 'community_challenges',
          organization_id: organization.id,
        });

        expect(refreshCommunity).toHaveBeenCalledWith(organization.id);
        expect(reloadGroupChallengeFeed).toHaveBeenCalledWith(organization.id);
        expect(navigateToCommunity).toHaveBeenCalledWith(
          organization,
          GROUP_CHALLENGES,
        );
      });

      it('should navigate to global community if no id passed', async () => {
        const global_community = { id: GLOBAL_COMMUNITY_ID };
        (refreshCommunity as jest.Mock).mockReturnValue(() => global_community);
        await testNotification({
          screen: 'community_challenges',
          organization_id: undefined,
        });
        expect(refreshCommunity).toHaveBeenCalledWith(undefined);
        expect(reloadGroupChallengeFeed).toHaveBeenCalledWith(undefined);
        expect(navigateToCommunity).toHaveBeenCalledWith(
          global_community,
          GROUP_CHALLENGES,
        );
      });
      it('should navigate to global community if Id is null', async () => {
        const global_community = { id: GLOBAL_COMMUNITY_ID };
        (refreshCommunity as jest.Mock).mockReturnValue(() => global_community);
        await testNotification({
          screen: 'community_challenges',
          organization_id: null,
        });
        expect(refreshCommunity).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
        expect(reloadGroupChallengeFeed).toHaveBeenCalledWith(
          GLOBAL_COMMUNITY_ID,
        );
        expect(navigateToCommunity).toHaveBeenCalledWith(
          global_community,
          GROUP_CHALLENGES,
        );
      });
    });
  });
});

describe('deletePushToken', () => {
  it('should not make an api request if there is nothing to delete', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
      },
    });

    // @ts-ignore
    store.dispatch(deletePushToken());

    expect(callApi).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
  it('should delete the push notification device token', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {
          id: '1',
        },
      },
    });
    // @ts-ignore
    callApi.mockReturnValue({ type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS });

    // @ts-ignore
    store.dispatch(deletePushToken());

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
