import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PushNotification from 'react-native-push-notification';
jest.mock('react-native-push-notification');
jest.mock('react-native-config', () => ({
  Config: {
    GCM_SENDER_ID: 'Test GCM Sender ID',
    APNS_SANDBOX: false,
  },
}));

import {
  enableAskPushNotification,
  disableAskPushNotification,
  noNotificationReminder,
  showReminderScreen,
  reregisterNotificationHandler,
  registerNotificationHandler,
} from '../../src/actions/notifications';
import {
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  PUSH_NOTIFICATION_REMINDER,
  GCM_SENDER_ID, LOAD_PERSON_DETAILS,
} from '../../src/constants';
import * as common from '../../src/utils/common';
import callApi, { REQUESTS } from '../../src/actions/api';
jest.mock('../../src/actions/api');
import { getPersonDetails } from '../../src/actions/person';
import { PushNotificationIOS } from 'react-native';
jest.mock('../../src/actions/person');

const mockStore = configureStore([ thunk ]);
const store = mockStore({ notifications: {} });

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

describe('noNotificationReminder', () => {
  it('should dispatch action to turn off notification reminders', () => {
    store.dispatch(noNotificationReminder(false));
    expect(store.getActions()).toEqual([ { type: PUSH_NOTIFICATION_REMINDER, bool: false } ]);
  });
  it('should dispatch action to turn on notification reminders', () => {
    store.dispatch(noNotificationReminder(true));
    expect(store.getActions()).toEqual([ { type: PUSH_NOTIFICATION_REMINDER, bool: true } ]);
  });
});

describe('showReminderScreen', () => {
  it('should setup android notifications', () => {
    const store = mockStore({
      notifications: {
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
        token: '123',
      },
    });
    store.dispatch(showReminderScreen());
    expect(store.getActions()).toEqual([]);
  });
  it('should do nothing if reminders are disabled', () => {
    const store = mockStore({
      notifications: {
        showReminder: false,
      },
    });
    store.dispatch(showReminderScreen());
    expect(store.getActions()).toEqual([]);
  });
  it('should do nothing if permissions are already granted', () => {
    const store = mockStore({
      notifications: {
        showReminder: true,
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
        showReminder: true,
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
        showReminder: true,
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
        showReminder: true,
        hasAsked: false,
      },
    });
    store.dispatch(showReminderScreen());

    store.getActions()[0].params.onComplete();

    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('reregisterNotificationHandler', () => {
  it('should register android notifications', () => {
    common.isAndroid = true;
    store.dispatch(reregisterNotificationHandler());

    expect(store.getActions()).toEqual([ { type: PUSH_NOTIFICATION_ASKED } ]);
    expect(PushNotification.checkPermissions).not.toHaveBeenCalled();
    expect(PushNotification.configure).toHaveBeenCalled();
  });

  it('should not register notifications if app doesn\'t have permissions', () => {
    PushNotification.checkPermissions.mockImplementation((cb) => cb({ alert: false }));

    store.dispatch(reregisterNotificationHandler());

    expect(PushNotification.checkPermissions).toHaveBeenCalled();
    expect(PushNotification.configure).not.toHaveBeenCalled();
  });

  it('should register notifications if app has permissions', () => {
    PushNotification.checkPermissions.mockImplementation((cb) => cb({ alert: true }));

    store.dispatch(reregisterNotificationHandler());

    expect(PushNotification.checkPermissions).toHaveBeenCalled();
    expect(PushNotification.configure).toHaveBeenCalled();
  });
});

describe('registerNotificationHandler', () => {
  it('should configure notifications', () => {
    store.dispatch(registerNotificationHandler());

    expect(PushNotification.configure).toHaveBeenCalledWith({
      onRegister: expect.any(Function),
      onNotification: expect.any(Function),
      senderID: GCM_SENDER_ID,
      requestPermissions: false,
    });
    expect(store.getActions()).toEqual([ { type: PUSH_NOTIFICATION_ASKED } ]);
  });

  describe('onRegister', () => {
    const oldToken = 'Old Token';
    const newToken = 'New Token';
    const store = mockStore({
      notifications: {
        token: oldToken,
      },
    });

    beforeEach(() => {
      PushNotification.configure.mockImplementation((config) => config.onRegister({ token: newToken }));
      callApi.mockReturnValue({ type: REQUESTS.SET_PUSH_TOKEN.SUCCESS });
      store.clearActions();
    });

    it('should update notification token for iOS devices', () => {
      store.dispatch(registerNotificationHandler());

      expect(callApi.mock.calls).toMatchSnapshot();
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should update notification token for android devices', () => {
      common.isAndroid = true;
      store.dispatch(registerNotificationHandler());

      expect(callApi.mock.calls).toMatchSnapshot();
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should do nothing if the token hasn\'t changed', () => {
      PushNotification.configure.mockImplementation((config) => config.onRegister({ token: oldToken }));
      store.dispatch(registerNotificationHandler());

      expect(callApi).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([ { type: PUSH_NOTIFICATION_ASKED } ]);
    });
  });

  describe('onNotification', () => {
    const user = { id: '1', type: 'person' };

    const store = mockStore({
      auth: {
        isJean: true,
        user,
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
      getPersonDetails.mockReturnValue({ type: LOAD_PERSON_DETAILS, response: user });
      await testNotification({ screen: 'person_steps', person_id: '1', organization_id: '2' });
      expect(getPersonDetails).toHaveBeenCalledWith('1', '2');
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should deep link to contact screen on iOS', async() => {
      common.isAndroid = false;
      getPersonDetails.mockReturnValue({ type: LOAD_PERSON_DETAILS, response: user });
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
