/* eslint max-lines: 0 */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';
import i18next from 'i18next';
import MockDate from 'mockdate';

import {
  showNotificationPrompt,
  deletePushToken,
  showWelcomeNotification,
  configureNotificationHandler,
  requestNativePermissions,
  showReminderOnLoad,
  parseNotificationData,
} from '../notifications';
import {
  GCM_SENDER_ID,
  LOAD_PERSON_DETAILS,
  DISABLE_WELCOME_NOTIFICATION,
  LOAD_HOME_NOTIFICATION_REMINDER,
  REQUEST_NOTIFICATIONS,
  GLOBAL_COMMUNITY_ID,
} from '../../constants';
import * as common from '../../utils/common';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { getPersonDetails, navToPersonScreen } from '../person';
import {
  navigatePush,
  navigateBack,
  navigateReset,
  navigateToMainTabs,
  navigateToCommunity,
  navigateToCelebrateComments,
} from '../navigation';
import { refreshCommunity } from '../organizations';
import { reloadGroupCelebrateFeed } from '../celebration';
import { reloadGroupChallengeFeed } from '../challenges';
import { NOTIFICATION_OFF_SCREEN } from '../../containers/NotificationOffScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../../containers/NotificationPrimerScreen';
import { GROUP_CHALLENGES } from '../../containers/Groups/GroupScreen';
import { ADD_PERSON_THEN_STEP_SCREEN_FLOW } from '../../routes/constants';

jest.mock('../person');
jest.mock('../organizations');
jest.mock('../celebration');
jest.mock('../challenges');
jest.mock('../navigation');
jest.mock('../api');
jest.mock('react-native-push-notification');
jest.mock('react-native-config', () => ({
  GCM_SENDER_ID: 'Test GCM Sender ID',
}));
jest.mock('../../selectors/organizations');

const mockStore = configureStore([thunk]);
const store = mockStore({
  notifications: {
    pushDevice: {},
  },
});

const navigatePushResult = { type: 'nagivate push' };
const navigateBackResult = { type: 'navigate back' };
const navigateResetResult = { type: 'navigate reset' };
const navigateToMainTabsResult = { type: 'navigateToMainTabs' };
const screen_extra_data = JSON.stringify({ celebration_item_id: '111' });

beforeEach(() => {
  common.isAndroid = false;
  store.clearActions();
});

describe('showNotificationPrompt', () => {
  const notificationType = 'type';
  let existingDevicePermissions = {};
  let newPermissions = {};
  let acceptedNotifications = true;
  let store = {};
  let result = {};

  beforeEach(() => {
    store = mockStore({
      notifications: {
        pushDevice: {},
      },
    });

    PushNotification.checkPermissions.mockImplementation(cb =>
      cb(existingDevicePermissions),
    );
    PushNotification.requestPermissions.mockReturnValue(newPermissions);
    navigatePush.mockImplementation((_, { onComplete }) => {
      onComplete && onComplete(acceptedNotifications);
      return navigatePushResult;
    });
    navigateBack.mockReturnValue(navigateBackResult);
    navigateToMainTabs.mockReturnValue(navigateToMainTabsResult);
  });

  describe('User accepts notifications', () => {
    beforeAll(() => {
      newPermissions = { alert: 1 };
      acceptedNotifications = true;
    });

    describe('isAndroid', () => {
      beforeEach(() => {
        common.isAndroid = true;
      });

      it('should request permissions from device', async () => {
        result = await store.dispatch(showNotificationPrompt());

        expect(PushNotification.checkPermissions).not.toHaveBeenCalled();
        expect(PushNotification.requestPermissions).toHaveBeenCalled();
        expect(store.getActions()).toEqual([{ type: REQUEST_NOTIFICATIONS }]);
        expect(result).toEqual({ acceptedNotifications });
      });
    });

    describe('not isAndroid', () => {
      beforeEach(() => {
        common.isAndroid = false;
      });

      describe('existing device permissions are enabled', () => {
        beforeAll(() => {
          existingDevicePermissions = { alert: 1 };
        });

        it('should check permissions from device then request permissions', async () => {
          result = await store.dispatch(showNotificationPrompt());

          expect(PushNotification.checkPermissions).toHaveBeenCalled();
          expect(PushNotification.requestPermissions).toHaveBeenCalled();
          expect(store.getActions()).toEqual([{ type: REQUEST_NOTIFICATIONS }]);
          expect(result).toEqual({ acceptedNotifications });
        });
      });

      describe('existing device permissions not enabled', () => {
        beforeAll(() => {
          existingDevicePermissions = { alert: 0 };
        });

        describe('user has seen native notifications modal before', () => {
          beforeEach(() => {
            store = mockStore({
              notifications: {
                pushDevice: {},
                requestedNativePermissions: true,
              },
            });
          });

          it('should show Notification Off screen', async () => {
            result = await store.dispatch(
              showNotificationPrompt(notificationType),
            );

            expect(PushNotification.checkPermissions).toHaveBeenCalled();
            expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_OFF_SCREEN, {
              onComplete: expect.any(Function),
              notificationType,
            });
            expect(navigateBack).toHaveBeenCalledWith();
            expect(store.getActions()).toEqual([
              navigateBackResult,
              navigatePushResult,
            ]);
            expect(result).toEqual({ acceptedNotifications });
          });

          it('should show Notification Off screen without navigate back', async () => {
            result = await store.dispatch(
              showNotificationPrompt(notificationType, true),
            );

            expect(PushNotification.checkPermissions).toHaveBeenCalled();
            expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_OFF_SCREEN, {
              onComplete: expect.any(Function),
              notificationType,
            });
            expect(navigateBack).not.toHaveBeenCalled();
            expect(store.getActions()).toEqual([navigatePushResult]);
            expect(result).toEqual({ acceptedNotifications });
          });
        });

        describe('user has not seen native notifications modal before', () => {
          beforeEach(() => {
            store = mockStore({
              notifications: {
                pushDevice: {},
                requestedNativePermissions: false,
              },
            });
          });

          it('should show Notification Primer screen', async () => {
            result = await store.dispatch(
              showNotificationPrompt(notificationType),
            );

            expect(PushNotification.checkPermissions).toHaveBeenCalled();
            expect(navigatePush).toHaveBeenCalledWith(
              NOTIFICATION_PRIMER_SCREEN,
              {
                onComplete: expect.any(Function),
                notificationType,
              },
            );
            expect(navigateBack).toHaveBeenCalledWith();
            expect(store.getActions()).toEqual([
              navigateBackResult,
              navigatePushResult,
            ]);
            expect(result).toEqual({ acceptedNotifications });
          });

          it('should show Notification Primer screen without navigate back', async () => {
            result = await store.dispatch(
              showNotificationPrompt(notificationType, true),
            );

            expect(PushNotification.checkPermissions).toHaveBeenCalled();
            expect(navigatePush).toHaveBeenCalledWith(
              NOTIFICATION_PRIMER_SCREEN,
              {
                onComplete: expect.any(Function),
                notificationType,
              },
            );
            expect(navigateBack).not.toHaveBeenCalled();
            expect(store.getActions()).toEqual([navigatePushResult]);
            expect(result).toEqual({ acceptedNotifications });
          });
        });
      });
    });
  });

  describe('User denies notifications', () => {
    beforeAll(() => {
      newPermissions = { alert: 0 };
      acceptedNotifications = false;
    });

    describe('isAndroid', () => {
      beforeEach(() => {
        common.isAndroid = true;
      });

      it('should request permissions from device', async () => {
        result = await store.dispatch(showNotificationPrompt());

        expect(PushNotification.checkPermissions).not.toHaveBeenCalled();
        expect(store.getActions()).toEqual([{ type: REQUEST_NOTIFICATIONS }]);
        expect(result).toEqual({ acceptedNotifications });
      });
    });

    describe('not isAndroid', () => {
      beforeEach(() => {
        common.isAndroid = false;
      });

      describe('existing device permissions are enabled', () => {
        beforeAll(() => {
          existingDevicePermissions = { alert: 1 };
        });

        it('should check permissions from device then request permissions', async () => {
          result = await store.dispatch(showNotificationPrompt());

          expect(PushNotification.checkPermissions).toHaveBeenCalled();
          expect(store.getActions()).toEqual([{ type: REQUEST_NOTIFICATIONS }]);
          expect(result).toEqual({ acceptedNotifications });
        });
      });

      describe('existing device permissions not enabled', () => {
        beforeAll(() => {
          existingDevicePermissions = { alert: 0 };
        });

        describe('user has seen native notifications modal before', () => {
          beforeEach(() => {
            store = mockStore({
              notifications: {
                pushDevice: {},
                requestedNativePermissions: true,
              },
            });
          });

          it('should show Notification Off screen', async () => {
            result = await store.dispatch(showNotificationPrompt());

            expect(PushNotification.checkPermissions).toHaveBeenCalled();
            expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_OFF_SCREEN, {
              onComplete: expect.any(Function),
            });
            expect(navigateBack).toHaveBeenCalledWith();
            expect(store.getActions()).toEqual([
              navigateBackResult,
              navigatePushResult,
            ]);
            expect(result).toEqual({ acceptedNotifications });
          });

          it('should show Notification Off screen without navigate back', async () => {
            result = await store.dispatch(
              showNotificationPrompt(notificationType, true),
            );

            expect(PushNotification.checkPermissions).toHaveBeenCalled();
            expect(navigatePush).toHaveBeenCalledWith(NOTIFICATION_OFF_SCREEN, {
              onComplete: expect.any(Function),
              notificationType,
            });
            expect(navigateBack).not.toHaveBeenCalled();
            expect(store.getActions()).toEqual([navigatePushResult]);
            expect(result).toEqual({ acceptedNotifications });
          });
        });

        describe('user has not seen native notifications modal before', () => {
          beforeEach(() => {
            store = mockStore({
              notifications: {
                pushDevice: {},
                requestedNativePermissions: false,
              },
            });
          });

          it('should show Notification Primer screen', async () => {
            result = await store.dispatch(
              showNotificationPrompt(notificationType),
            );

            expect(PushNotification.checkPermissions).toHaveBeenCalled();
            expect(navigatePush).toHaveBeenCalledWith(
              NOTIFICATION_PRIMER_SCREEN,
              {
                onComplete: expect.any(Function),
                notificationType,
              },
            );
            expect(navigateBack).toHaveBeenCalledWith();
            expect(store.getActions()).toEqual([
              navigateBackResult,
              navigatePushResult,
            ]);
            expect(result).toEqual({ acceptedNotifications });
          });

          it('should show Notification Primer screen without navigate back', async () => {
            result = await store.dispatch(
              showNotificationPrompt(notificationType, true),
            );

            expect(PushNotification.checkPermissions).toHaveBeenCalled();
            expect(navigatePush).toHaveBeenCalledWith(
              NOTIFICATION_PRIMER_SCREEN,
              {
                onComplete: expect.any(Function),
                notificationType,
              },
            );
            expect(navigateBack).not.toHaveBeenCalled();
            expect(store.getActions()).toEqual([navigatePushResult]);
            expect(result).toEqual({ acceptedNotifications });
          });
        });
      });
    });
  });
});

describe('showReminderOnLoad', () => {
  const notificationType = 'type';

  beforeEach(() => {
    store.dispatch(configureNotificationHandler());
    PushNotification.checkPermissions.mockImplementation(cb =>
      cb({ alert: 0 }),
    );
    PushNotification.requestPermissions.mockReturnValue({ alert: 0 });
    navigatePush.mockImplementation((_, { onComplete }) => {
      onComplete && onComplete(true);
      return navigatePushResult;
    });
    navigateBack.mockReturnValue(navigateBackResult);
  });

  it('should not show reminder screen if showReminderOnLoad is false', async () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        showReminderOnLoad: false,
      },
    });

    await store.dispatch(showReminderOnLoad(notificationType));

    expect(PushNotification.checkPermissions).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });

  it('should show reminder screen if showReminderOnLoad is true', async () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        showReminderOnLoad: true,
      },
    });

    await store.dispatch(showReminderOnLoad(notificationType));

    expect(PushNotification.checkPermissions).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      { type: LOAD_HOME_NOTIFICATION_REMINDER },
      navigateBackResult,
      navigatePushResult,
    ]);
  });
});

describe('configureNotificationHandler', () => {
  it('should configure notifications', () => {
    store.dispatch(configureNotificationHandler());

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
    PushNotification.requestPermissions.mockReturnValue({ alert: 1 });
    navigateReset.mockReturnValue(navigateResetResult);
  });

  describe('onRegister', () => {
    const oldToken = 'Old Token';
    const newToken = 'New Token';
    const store = mockStore({
      notifications: {
        pushDevice: {
          token: oldToken,
        },
      },
    });

    beforeEach(() => {
      PushNotification.configure.mockImplementation(config =>
        config.onRegister({ token: newToken }),
      );
      callApi.mockReturnValue({ type: REQUESTS.SET_PUSH_TOKEN.SUCCESS });
      store.clearActions();
    });

    it('should update notification token for iOS devices', async () => {
      store.dispatch(configureNotificationHandler());
      await store.dispatch(requestNativePermissions());

      expect(callApi.mock.calls).toMatchSnapshot();
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should update notification token for android devices', async () => {
      common.isAndroid = true;
      store.dispatch(configureNotificationHandler());
      await store.dispatch(requestNativePermissions());

      expect(callApi.mock.calls).toMatchSnapshot();
      expect(store.getActions()).toMatchSnapshot();
    });

    it("should do nothing if the token hasn't changed", async () => {
      PushNotification.configure.mockImplementation(config =>
        config.onRegister({ token: oldToken }),
      );
      store.dispatch(configureNotificationHandler());
      await store.dispatch(requestNativePermissions());

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

    const store = mockStore({
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
    const reloadGroupCelebrateFeedResult = { type: 'reload celebrate feed' };
    const reloadGroupChallengeFeedResult = { type: 'reload challenge feed' };
    const navToCelebrateResult = { type: 'navigated to celebrate comments' };
    const navToCommunityResult = { type: 'navigated to community' };

    beforeEach(() => {
      common.isAndroid = true;
      store.clearActions();
      getPersonDetails.mockReturnValue(getPersonResult);
      navToPersonScreen.mockReturnValue(navToPersonScreenResult);
      refreshCommunity.mockReturnValue(() => refreshCommunityResult);
      reloadGroupCelebrateFeed.mockReturnValue(reloadGroupCelebrateFeedResult);
      reloadGroupChallengeFeed.mockReturnValue(reloadGroupChallengeFeedResult);
      navigateToCelebrateComments.mockReturnValue(navToCelebrateResult);
      navigateToCommunity.mockReturnValue(navToCommunityResult);
    });

    async function testNotification(notification, userInteraction = true) {
      const deepLinkComplete = new Promise(resolve =>
        PushNotification.configure.mockImplementation(async config => {
          await store.dispatch(requestNativePermissions());
          await config.onNotification({
            ...notification,
            userInteraction,
            finish,
          });
          resolve();
        }),
      );
      store.dispatch(configureNotificationHandler());
      await deepLinkComplete;
    }

    describe('userInteraction = false', () => {
      it('on iOS, should call iOS finish', async () => {
        common.isAndroid = false;

        await testNotification({ screen: 'home' }, false);

        expect(navigateToMainTabs).toHaveBeenCalled();
        expect(finish).toHaveBeenCalledWith(
          PushNotificationIOS.FetchResult.NoData,
        );
        expect(store.getActions()).toEqual([
          { type: REQUEST_NOTIFICATIONS },
          navigateToMainTabsResult,
        ]);
      });

      it('on Android, should do nothing', async () => {
        common.isAndroid = true;

        await testNotification({ screen: 'home' }, false);

        expect(store.getActions()).toEqual([{ type: REQUEST_NOTIFICATIONS }]);
      });
    });

    it('should deep link to home screen', async () => {
      await testNotification({ screen: 'home' });

      expect(navigateToMainTabs).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        { type: REQUEST_NOTIFICATIONS },
        navigateToMainTabsResult,
      ]);
    });

    it('should deep link to main steps tab screen', async () => {
      await testNotification({ screen: 'steps' });

      expect(navigateToMainTabs).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        { type: REQUEST_NOTIFICATIONS },
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
        { type: REQUEST_NOTIFICATIONS },
        getPersonResult,
        navToPersonScreenResult,
      ]);
    });

    it('should deep link to contact screen on iOS', async () => {
      common.isAndroid = false;

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
        { type: REQUEST_NOTIFICATIONS },
        getPersonResult,
        navToPersonScreenResult,
      ]);
    });

    it("should deep link to ME user's contact screen", async () => {
      await testNotification({ screen: 'my_steps' });

      expect(navToPersonScreen).toHaveBeenCalledWith(person);
      expect(store.getActions()).toEqual([
        { type: REQUEST_NOTIFICATIONS },
        navToPersonScreenResult,
      ]);
    });

    it('should deep link to add contact screen', async () => {
      navigatePush.mockReturnValue(navigatePushResult);

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
        { type: REQUEST_NOTIFICATIONS },
        navigatePushResult,
      ]);
    });

    describe('parseNotificationData', () => {
      const notification = {
        screen: 'celebrate',
        organization_id: organization.id,
        screen_extra_data,
      };

      const iosNotification = {
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

    describe('celebrate', () => {
      it('should look for stored org', async () => {
        await testNotification({
          screen: 'celebrate',
          organization_id: organization.id,
          screen_extra_data,
        });

        expect(refreshCommunity).toHaveBeenCalledWith(organization.id);
        expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(organization.id);
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
        expect(reloadGroupCelebrateFeed).not.toHaveBeenCalled();
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
        refreshCommunity.mockReturnValue(() => global_community);
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
    callApi.mockReturnValue({ type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS });

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

describe('showWelcomeNotification', () => {
  it('should do nothing if disabled', () => {
    const store = mockStore({
      notifications: {
        hasShownWelcomeNotification: true,
      },
    });
    store.dispatch(showWelcomeNotification());
    expect(PushNotification.localNotificationSchedule).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });

  it('should queue local notification', () => {
    const mockDate = '2018-01-01';
    MockDate.set(mockDate);

    const store = mockStore({
      notifications: {
        hasShownWelcomeNotification: false,
      },
    });
    store.dispatch(showWelcomeNotification());
    expect(PushNotification.localNotificationSchedule).toHaveBeenCalledWith({
      title: i18next.t('welcomeNotification:title'),
      message: i18next.t('welcomeNotification:message'),
      date: new Date(`${mockDate}T00:00:03.000Z`),
    });
    expect(store.getActions()).toEqual([
      {
        type: DISABLE_WELCOME_NOTIFICATION,
      },
    ]);

    MockDate.reset();
  });
});