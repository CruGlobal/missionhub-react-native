import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PushNotification from 'react-native-push-notification';
jest.mock('react-native-push-notification');
jest.mock('react-native-config', () => ({
  GCM_SENDER_ID: 'Test GCM Sender ID',
  APNS_MODE: 'APNS',
}));

import {
  enableAskPushNotification,
  disableAskPushNotification,
  showReminderScreen,
  reregisterNotificationHandler,
  registerNotificationHandler,
  deletePushToken,
  showWelcomeNotification,
  configureNotificationHandler,
} from '../../src/actions/notifications';
import {
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  GCM_SENDER_ID, LOAD_PERSON_DETAILS,
  DISABLE_WELCOME_NOTIFICATION,
  NAVIGATE_FORWARD,
} from '../../src/constants';
import * as common from '../../src/utils/common';
import callApi, { REQUESTS } from '../../src/actions/api';
jest.mock('../../src/actions/api');
import { getPersonDetails } from '../../src/actions/person';
jest.mock('../../src/actions/person');
import { PushNotificationIOS } from 'react-native';
import i18next from 'i18next';
import MockDate from 'mockdate';
import { NOTIFICATION_PRIMER_SCREEN } from '../../src/containers/NotificationPrimerScreen';

const mockStore = configureStore([ thunk ]);
const store = mockStore({
  notifications: {
    pushDevice: {},
  },
});

beforeEach(() => {
  common.isAndroid = false;
  store.clearActions();
  PushNotification.configure.mockReset();
  jest.clearAllMocks();
});

describe('disableAskPushNotification', () => {
  it('should dispatch action to disable notification prompts', () => {
    store.dispatch(disableAskPushNotification());
    expect(store.getActions()).toEqual([ { type: PUSH_NOTIFICATION_SHOULD_ASK, bool: false } ]);
  });
});

describe('enableAskPushNotification', () => {
  it('should dispatch action to enable notification prompts', () => {
    store.dispatch(enableAskPushNotification());
    expect(store.getActions()).toEqual([ { type: PUSH_NOTIFICATION_SHOULD_ASK, bool: true } ]);
  });
});

describe('showReminderScreen', () => {
  it('should setup android notifications', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        shouldAsk: true,
      },
    });
    common.isAndroid = true;
    store.dispatch(showReminderScreen());
    expect(store.getActions()).toEqual([ { type: PUSH_NOTIFICATION_ASKED } ]);
  });
  it('should do nothing if we already have a token', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {
          token: '123',
        },
      },
    });
    store.dispatch(showReminderScreen());
    expect(store.getActions()).toEqual([]);
  });
  it('should do nothing if reminders are disabled', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        shouldAsk: false,
      },
    });
    store.dispatch(showReminderScreen());
    expect(store.getActions()).toEqual([]);
  });
  it('should do nothing if permissions are already granted', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        shouldAsk: true,
        hasAsked: true,
      },
    });
    PushNotification.checkPermissions.mockImplementation((cb) => cb({ alert: true }));
    store.dispatch(showReminderScreen());

    expect(store.getActions()).toEqual([]);
  });
  it('should show Notification Off screen and enable notifications', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        shouldAsk: true,
        hasAsked: true,
      },
    });
    PushNotification.checkPermissions.mockImplementation((cb) => cb({ alert: false }));
    store.dispatch(showReminderScreen());

    store.getActions()[0].params.onClose(true);

    expect(store.getActions()).toMatchSnapshot();
  });
  it('should show Notification Off screen and disable notifications', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        shouldAsk: true,
        hasAsked: true,
      },
    });
    PushNotification.checkPermissions.mockImplementation((cb) => cb({ alert: false }));
    store.dispatch(showReminderScreen());

    store.getActions()[0].params.onClose(false);

    expect(store.getActions()).toMatchSnapshot();
  });
  it('should show Notification Primer screen', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        shouldAsk: true,
        hasAsked: false,
      },
    });
    store.dispatch(showReminderScreen());

    store.getActions()[0].params.onComplete();

    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('reregisterNotificationHandler', () => {

  beforeEach(() => {
    store.dispatch(configureNotificationHandler());
  });

  it('should register android notifications', () => {
    common.isAndroid = true;
    store.dispatch(reregisterNotificationHandler());

    expect(PushNotification.checkPermissions).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([ { type: PUSH_NOTIFICATION_ASKED } ]);
    expect(PushNotification.requestPermissions).toHaveBeenCalled();
  });

  it('should not register notifications if app doesn\'t have permissions and doesn\'t have reminders', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        shouldAsk: true,
        hasAsked: false,
      },
      steps: {
        reminders: [],
      },
    });

    PushNotification.checkPermissions.mockImplementation((cb) => cb({ alert: false }));

    store.dispatch(reregisterNotificationHandler());

    expect(PushNotification.checkPermissions).toHaveBeenCalled();
    expect(PushNotification.requestPermissions).not.toHaveBeenCalled();
  });

  it('should show reminder screen if app doesn\'t have permissions and has reminders', () => {
    const store = mockStore({
      notifications: {
        pushDevice: {},
        shouldAsk: true,
        hasAsked: false,
      },
      steps: {
        reminders: [ { id: 1 } ],
      },
    });

    PushNotification.checkPermissions.mockImplementation((cb) => cb({ alert: false }));

    store.dispatch(reregisterNotificationHandler());

    expect(PushNotification.checkPermissions).toHaveBeenCalled();
    expect(PushNotification.requestPermissions).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      {
        params: {
          onComplete: expect.any(Function),
        },
        routeName: NOTIFICATION_PRIMER_SCREEN,
        type: NAVIGATE_FORWARD,
      },
    ]);
  });

  it('should register notifications if app has permissions', () => {
    PushNotification.checkPermissions.mockImplementation((cb) => cb({ alert: true }));

    store.dispatch(reregisterNotificationHandler());

    expect(PushNotification.checkPermissions).toHaveBeenCalled();
    expect(PushNotification.requestPermissions).toHaveBeenCalled();
  });
});

describe('configureNotificaitonHandler', () => {
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

describe('registerNotificationHandler', () => {
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
      PushNotification.configure.mockImplementation((config) => config.onRegister({ token: newToken }));
      callApi.mockReturnValue({ type: REQUESTS.SET_PUSH_TOKEN.SUCCESS });
      store.clearActions();
    });

    it('should update notification token for iOS devices', () => {
      store.dispatch(configureNotificationHandler());
      store.dispatch(registerNotificationHandler());

      expect(callApi.mock.calls).toMatchSnapshot();
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should update notification token for android devices', () => {
      common.isAndroid = true;
      store.dispatch(configureNotificationHandler());
      store.dispatch(registerNotificationHandler());

      expect(callApi.mock.calls).toMatchSnapshot();
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should do nothing if the token hasn\'t changed', () => {
      PushNotification.configure.mockImplementation((config) => config.onRegister({ token: oldToken }));
      store.dispatch(configureNotificationHandler());
      store.dispatch(registerNotificationHandler());

      expect(callApi).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([ { type: PUSH_NOTIFICATION_ASKED } ]);
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
      const deepLinkComplete = new Promise((resolve) =>
        PushNotification.configure.mockImplementation(async(config) => {
          await config.onNotification({
            ...notification,
            userInteraction,
            finish,
          });
          resolve();
        })
      );
      store.dispatch(configureNotificationHandler());
      store.dispatch(registerNotificationHandler());
      return await deepLinkComplete;
    }

    it('should do nothing if user hasn\'t opened the notification; also it should call iOS finish', async() => {
      await testNotification({ screen: 'home' }, false);
      expect(store.getActions()).toEqual([ { type: PUSH_NOTIFICATION_ASKED } ]);
      expect(finish).toHaveBeenCalledWith(PushNotificationIOS.FetchResult.NoData);
    });

    it('should deep link to home screen', () => {
      testNotification({ screen: 'home' });
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should deep link to main steps tab screen', () => {
      testNotification({ screen: 'steps' });
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should deep link to contact screen', async() => {
      getPersonDetails.mockReturnValue({ type: LOAD_PERSON_DETAILS, person });
      await testNotification({ screen: 'person_steps', person_id: '1', organization_id: '2' });
      expect(getPersonDetails).toHaveBeenCalledWith('1', '2');
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should deep link to contact screen on iOS', async() => {
      common.isAndroid = false;
      getPersonDetails.mockReturnValue({ type: LOAD_PERSON_DETAILS, person });
      await testNotification({ data: { link: { data: { screen: 'person_steps', person_id: '1', organization_id: '2' } } } });
      expect(getPersonDetails).toHaveBeenCalledWith('1', '2');
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should deep link to ME user\'s contact screen', () => {
      testNotification({ screen: 'my_steps' });
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should deep link to add contact screen', () => {
      testNotification({ screen: 'add_a_person', person_id: '1', organization_id: '2' });
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

    expect(callApi).toHaveBeenCalledWith(REQUESTS.DELETE_PUSH_TOKEN, { deviceId: '1' } , {});
    expect(store.getActions()).toEqual([ { type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS } ]);
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
    expect(store.getActions()).toEqual([ {
      type: DISABLE_WELCOME_NOTIFICATION,
    } ]);

    MockDate.reset();
  });
});
