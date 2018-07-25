import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';
import i18next from 'i18next';
import MockDate from 'mockdate';

import {
  showReminderScreen,
  deletePushToken,
  showWelcomeNotification,
  configureNotificationHandler,
  requestNativePermissions,
  showReminderOnLoad,
} from '../../src/actions/notifications';
import {
  GCM_SENDER_ID,
  LOAD_PERSON_DETAILS,
  DISABLE_WELCOME_NOTIFICATION,
  NAVIGATE_FORWARD,
  LOAD_HOME_NOTIFICATION_REMINDER,
} from '../../src/constants';
import * as common from '../../src/utils/common';
import callApi, { REQUESTS } from '../../src/actions/api';
import { getPersonDetails } from '../../src/actions/person';
jest.mock('../../src/actions/person');
import { NOTIFICATION_PRIMER_SCREEN } from '../../src/containers/NotificationPrimerScreen';
jest.mock('../../src/actions/api');
jest.mock('react-native-push-notification');
jest.mock('react-native-config', () => ({
  GCM_SENDER_ID: 'Test GCM Sender ID',
  APNS_MODE: 'APNS',
}));

const mockStore = configureStore([thunk]);

beforeEach(() => {
  common.isAndroid = false;
  PushNotification.configure.mockReset();
  jest.clearAllMocks();
});

describe('showReminderScreen', () => {
  const descriptionText = 'test description';

  it('should do nothing for Android', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
      },
    });
    common.isAndroid = true;
    store.dispatch(showReminderScreen());
    expect(PushNotification.checkPermissions).not.toHaveBeenCalled();
  });
  it('should do nothing if we already have a token', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {
          token: '123',
        },
      },
    });
    store.dispatch(showReminderScreen(descriptionText));
    expect(store.getActions()).toEqual([]);
  });
  it('should do nothing if reminders are disabled', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
      },
    });
    store.dispatch(showReminderScreen(descriptionText));
    expect(store.getActions()).toEqual([]);
  });
  it('should do nothing if permissions are already granted', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
      },
    });
    PushNotification.checkPermissions.mockImplementation(cb =>
      cb({ alert: true }),
    );
    store.dispatch(showReminderScreen(descriptionText));

    expect(store.getActions()).toEqual([]);
  });
  it('should show Notification Primer screen', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
      },
    });
    PushNotification.checkPermissions.mockImplementation(cb =>
      cb({ alert: false }),
    );

    store.dispatch(showReminderScreen(descriptionText));

    store.getActions()[0].params.onComplete();

    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('showReminderOnLoad', () => {
  const steps = (hasReminders = false) => [
    { id: '1', focus: hasReminders, receiver: { id: '2' } },
  ];

  it("should not show reminder screen if app doesn't have reminders", () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        showReminderOnLoad: true,
      },
      steps: {
        mine: steps(false),
      },
    });

    store.dispatch(showReminderOnLoad());

    expect(PushNotification.checkPermissions).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      { type: LOAD_HOME_NOTIFICATION_REMINDER },
    ]);
  });

  it('should not show reminder screen if showReminderOnLoad is false', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        showReminderOnLoad: false,
      },
      steps: {
        mine: steps(true),
      },
    });

    store.dispatch(showReminderOnLoad());

    expect(PushNotification.checkPermissions).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });

  it('should show reminder screen if app has reminders and showReminderOnLoad is true', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        showReminderOnLoad: true,
      },
      steps: {
        mine: steps(true),
      },
    });

    PushNotification.checkPermissions.mockImplementation(cb =>
      cb({ alert: false }),
    );

    store.dispatch(showReminderOnLoad());

    expect(PushNotification.checkPermissions).toHaveBeenCalled();
    expect(PushNotification.requestPermissions).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      { type: LOAD_HOME_NOTIFICATION_REMINDER },
      {
        params: {
          onComplete: expect.any(Function),
          descriptionText: i18next.t('notificationPrimer:loginDescription'),
        },
        routeName: NOTIFICATION_PRIMER_SCREEN,
        type: NAVIGATE_FORWARD,
      },
    ]);
  });
});

describe('configureNotificaitonHandler', () => {
  it('should configure notifications', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
      },
    });

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

    it('should update notification token for iOS devices', () => {
      store.dispatch(configureNotificationHandler());
      store.dispatch(requestNativePermissions());

      expect(callApi.mock.calls).toMatchSnapshot();
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should update notification token for android devices', () => {
      common.isAndroid = true;
      store.dispatch(configureNotificationHandler());
      store.dispatch(requestNativePermissions());

      expect(callApi.mock.calls).toMatchSnapshot();
      expect(store.getActions()).toMatchSnapshot();
    });

    it("should do nothing if the token hasn't changed", () => {
      PushNotification.configure.mockImplementation(config =>
        config.onRegister({ token: oldToken }),
      );
      store.dispatch(configureNotificationHandler());
      store.dispatch(requestNativePermissions());

      expect(callApi).not.toHaveBeenCalled();
    });
  });

  describe('onNotification', () => {
    const person = { id: '1', type: 'person' };

    const store = mockStore({
      auth: {
        isJean: true,
        person,
      },
    });

    const finish = jest.fn();

    beforeEach(() => {
      common.isAndroid = true;
      store.clearActions();
    });

    async function testNotification(notification, userInteraction = true) {
      const deepLinkComplete = new Promise(resolve =>
        PushNotification.configure.mockImplementation(async config => {
          await config.onNotification({
            ...notification,
            userInteraction,
            finish,
          });
          resolve();
        }),
      );
      store.dispatch(configureNotificationHandler());
      store.dispatch(requestNativePermissions());
      return await deepLinkComplete;
    }

    it("should do nothing if user hasn't opened the notification; also it should call iOS finish", async () => {
      await testNotification({ screen: 'home' }, false);
      expect(finish).toHaveBeenCalledWith(
        PushNotificationIOS.FetchResult.NoData,
      );
    });

    it('should deep link to home screen', () => {
      testNotification({ screen: 'home' });
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should deep link to main steps tab screen', () => {
      testNotification({ screen: 'steps' });
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should deep link to contact screen', async () => {
      getPersonDetails.mockReturnValue({ type: LOAD_PERSON_DETAILS, person });
      await testNotification({
        screen: 'person_steps',
        person_id: '1',
        organization_id: '2',
      });
      expect(getPersonDetails).toHaveBeenCalledWith('1', '2');
      expect(store.getActions()).toMatchSnapshot();
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
      expect(store.getActions()).toMatchSnapshot();
    });

    it("should deep link to ME user's contact screen", () => {
      testNotification({ screen: 'my_steps' });
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should deep link to add contact screen', () => {
      testNotification({
        screen: 'add_a_person',
        person_id: '1',
        organization_id: '2',
      });
      store.getActions()[0].params.onComplete();
      expect(store.getActions()).toMatchSnapshot();
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
