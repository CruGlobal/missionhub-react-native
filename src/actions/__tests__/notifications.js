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
} from '../notifications';
import {
  GCM_SENDER_ID,
  LOAD_PERSON_DETAILS,
  DISABLE_WELCOME_NOTIFICATION,
  NAVIGATE_FORWARD,
  LOAD_HOME_NOTIFICATION_REMINDER,
  REQUEST_NOTIFICATIONS,
} from '../../constants';
import * as common from '../../utils/common';
import callApi, { REQUESTS } from '../api';
import { getPersonDetails, navToPersonScreen } from '../person';
import { navigatePush, navigateBack, navigateReset } from '../navigation';
import { navigateToOrg } from '../organizations';
import { NOTIFICATION_PRIMER_SCREEN } from '../../containers/NotificationPrimerScreen';
import { GROUP_CHALLENGES } from '../../containers/Groups/GroupScreen';

jest.mock('../person');
jest.mock('../organizations');
jest.mock('../navigation');
jest.mock('../api');
jest.mock('react-native-push-notification');
jest.mock('react-native-config', () => ({
  GCM_SENDER_ID: 'Test GCM Sender ID',
  APNS_MODE: 'APNS',
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

beforeEach(() => {
  common.isAndroid = false;
  store.clearActions();
});

describe('showNotificationPrompt', () => {
  const descriptionText = 'test description';
  let existingDevicePermissions = {};
  let newPermissions = {};
  let acceptedNotifications = true;
  let store = {};
  let result = {};

  beforeEach(() => {
    PushNotification.checkPermissions.mockImplementation(cb =>
      cb(existingDevicePermissions),
    );
    PushNotification.requestPermissions.mockReturnValue(newPermissions);
    navigatePush.mockImplementation((_, { onComplete }) => {
      onComplete && onComplete(acceptedNotifications);
      return navigatePushResult;
    });
    navigateBack.mockReturnValue(navigateBackResult);
  });

  describe('User accepts notifications', () => {
    beforeAll(() => {
      newPermissions = { alert: 1 };
      acceptedNotifications = true;
    });

    describe('isAndroid', () => {
      beforeEach(() => {
        store = mockStore({
          notifications: {
            pushDevice: {},
          },
        });
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

      describe('token already in Redux', () => {
        beforeAll(() => {
          store = mockStore({
            notifications: {
              pushDevice: {
                token: '123',
              },
            },
          });
        });

        it('should return acceptedNotifications = true', async () => {
          result = await store.dispatch(
            showNotificationPrompt(descriptionText),
          );

          expect(PushNotification.checkPermissions).not.toHaveBeenCalled();
          expect(store.getActions()).toEqual([]);
          expect(result).toEqual({ acceptedNotifications });
        });
      });

      describe('no token in Redux', () => {
        beforeAll(() => {
          store = mockStore({
            notifications: {
              pushDevice: {},
            },
          });
        });

        describe('existing device permissions are enabled', () => {
          beforeAll(() => {
            existingDevicePermissions = { alert: 1 };
          });

          it('should check permissions from device then request permissions', async () => {
            result = await store.dispatch(
              showNotificationPrompt(descriptionText),
            );

            expect(PushNotification.checkPermissions).toHaveBeenCalled();
            expect(store.getActions()).toEqual([
              { type: REQUEST_NOTIFICATIONS },
            ]);
            expect(result).toEqual({ acceptedNotifications });
          });
        });

        describe('existing device permissions not enabled', () => {
          beforeAll(() => {
            existingDevicePermissions = { alert: 0 };
          });

          describe('user has seen native notifications modal before', () => {
            beforeAll(() => {
              store = mockStore({
                notifications: {
                  pushDevice: {},
                  requestedNativePermissions: true,
                },
              });
            });

            it('should show Notification Off screen', async () => {
              result = await store.dispatch(
                showNotificationPrompt(descriptionText),
              );

              expect(PushNotification.checkPermissions).toHaveBeenCalled();
              expect(store.getActions()).toEqual([
                navigateBackResult,
                navigatePushResult,
              ]);
              expect(result).toEqual({ acceptedNotifications });
            });
          });

          describe('user has not seen native notifications modal before', () => {
            beforeAll(() => {
              store = mockStore({
                notifications: {
                  pushDevice: {},
                  requestedNativePermissions: false,
                },
              });
            });

            it('should show Notification Primer screen', async () => {
              result = await store.dispatch(
                showNotificationPrompt(descriptionText),
              );

              expect(PushNotification.checkPermissions).toHaveBeenCalled();
              expect(store.getActions()).toMatchSnapshot();
              expect(result).toEqual({ acceptedNotifications });
            });
          });
        });
      });
    });
  });
});

describe('showReminderOnLoad', () => {
  const steps = (hasReminders = false) => [
    { id: '1', focus: hasReminders, receiver: { id: '2' } },
  ];

  beforeEach(() => {
    store.dispatch(configureNotificationHandler());
    PushNotification.checkPermissions.mockImplementation(cb =>
      cb({ alert: 0 }),
    );
    PushNotification.requestPermissions.mockReturnValue({ alert: 0 });
    navigatePush.mockReturnValue(navigatePushResult);
  });

  it('should not show reminder screen if showReminderOnLoad is false', async () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        showReminderOnLoad: false,
      },
    });

    await store.dispatch(showReminderOnLoad());

    expect(PushNotification.checkPermissions).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });

  it('should show reminder screen if app has reminders and showReminderOnLoad is true', async () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        showReminderOnLoad: true,
      },
    });

    await store.dispatch(showReminderOnLoad());

    expect(PushNotification.checkPermissions).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      { type: LOAD_HOME_NOTIFICATION_REMINDER },
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
    const organization = { id: 234234 };
    const organizations = {
      someProp: 'hello, Roge',
    };

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

    beforeEach(() => {
      common.isAndroid = true;
      store.clearActions();
      getPersonDetails.mockReturnValue(getPersonResult);
      navToPersonScreen.mockReturnValue(navToPersonScreenResult);
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

        expect(finish).toHaveBeenCalledWith(
          PushNotificationIOS.FetchResult.NoData,
        );
        expect(store.getActions()).toEqual([
          { type: REQUEST_NOTIFICATIONS },
          navigateResetResult,
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
      expect(store.getActions()).toEqual([
        { type: REQUEST_NOTIFICATIONS },
        navigateResetResult,
      ]);
    });

    it('should deep link to main steps tab screen', async () => {
      await testNotification({ screen: 'steps' });
      expect(store.getActions()).toEqual([
        { type: REQUEST_NOTIFICATIONS },
        navigateResetResult,
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
      await testNotification({
        screen: 'add_a_person',
        person_id: '1',
        organization_id: '2',
      });
      store.getActions()[0].params.onComplete();
      expect(store.getActions()).toMatchSnapshot();
    });

    describe('celebrate', () => {
      it('should look for stored org', async () => {
        await testNotification({
          screen: 'celebrate',
          organization_id: organization.id,
        });
        expect(navigateToOrg).toHaveBeenCalledWith(`${organization.id}`);
      });
    });

    describe('community_challenges', () => {
      it('should look for stored org', async () => {
        await testNotification({
          screen: 'community_challenges',
          organization_id: organization.id,
        });
        expect(navigateToOrg).toHaveBeenCalledWith(
          `${organization.id}`,
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
