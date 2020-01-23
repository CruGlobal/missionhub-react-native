import { Linking } from 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
// @ts-ignore
import PushNotification from 'react-native-push-notification';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import { trackActionWithoutData } from '../../../actions/analytics';
import { navigateBack } from '../../../actions/navigation';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../../constants';

import NotificationOffScreen from '..';

jest.mock('react-native-push-notification');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const {
  ONBOARDING,
  LOGIN,
  FOCUS_STEP,
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
} = NOTIFICATION_PROMPT_TYPES;

const mockStore = configureStore();
const APP_SETTINGS_URL = 'app-settings:';
// @ts-ignore
let store;
// @ts-ignore
let screen;
// @ts-ignore
let onComplete;

const navigateResult = { type: 'navigated back' };
const trackActionResult = { type: 'tracked action' };
const disabledPermissions = { alert: 0 };
const enabledPermissions = { alert: 1 };

describe('notification types', () => {
  let notificationType = '';

  const test = () => {
    testSnapshotShallow(
      <NotificationOffScreen
        navigation={{ state: {} }}
        // @ts-ignore
        onComplete={onComplete}
        notificationType={notificationType}
      />,
      // @ts-ignore
      store,
    );
  };

  it('renders for ONBOARDING', () => {
    notificationType = ONBOARDING;
    test();
  });

  it('renders for LOGIN', () => {
    notificationType = LOGIN;
    test();
  });

  it('renders for FOCUS_STEP', () => {
    notificationType = FOCUS_STEP;
    test();
  });

  it('renders for SET_REMINDER', () => {
    notificationType = SET_REMINDER;
    test();
  });

  it('renders for JOIN_COMMUNITY', () => {
    notificationType = JOIN_COMMUNITY;
    test();
  });

  it('renders for JOIN_CHALLENGE', () => {
    notificationType = JOIN_CHALLENGE;
    test();
  });
});

describe('button methods', () => {
  beforeEach(() => {
    store = mockStore();
    onComplete = jest.fn();
    // @ts-ignore
    global.setTimeout = jest.fn(callback => callback());

    screen = renderShallow(
      <NotificationOffScreen
        navigation={{ state: {} }}
        // @ts-ignore
        onComplete={onComplete}
        notificationType={ONBOARDING}
      />,
      store,
    );

    // @ts-ignore
    trackActionWithoutData.mockReturnValue(trackActionResult);
    // @ts-ignore
    navigateBack.mockReturnValue(navigateResult);
  });

  describe('not now button', () => {
    beforeEach(() => {
      // @ts-ignore
      PushNotification.checkPermissions.mockImplementation(callback =>
        callback(disabledPermissions),
      );
    });

    it('calls onComplete and tracks an action', () => {
      // @ts-ignore
      screen
        .childAt(3)
        .childAt(1)
        .props()
        .onPress();

      // @ts-ignore
      expect(onComplete).toHaveBeenCalledWith(false);
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NO_REMINDERS);
      // @ts-ignore
      expect(store.getActions()).toEqual([trackActionResult]);
    });
  });

  describe('go to settings button', () => {
    beforeEach(() => {
      jest.mock('react-native');
    });

    describe('user enables permissions', () => {
      beforeEach(() => {
        // @ts-ignore
        PushNotification.checkPermissions.mockImplementation(callback =>
          callback(enabledPermissions),
        );
      });

      it('opens settings menu, then calls onComplete when returning', async () => {
        // @ts-ignore
        await screen
          .childAt(3)
          .childAt(0)
          .props()
          .onPress();

        expect(Linking.canOpenURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        expect(Linking.openURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        // @ts-ignore
        expect(onComplete).toHaveBeenCalledWith(true);
      });
    });

    describe('user does not enable permissions', () => {
      beforeEach(() => {
        // @ts-ignore
        PushNotification.checkPermissions.mockImplementation(callback =>
          callback(disabledPermissions),
        );
      });

      it('opens settings menu, then calls onComplete when returning', async () => {
        // @ts-ignore
        await screen
          .childAt(3)
          .childAt(0)
          .props()
          .onPress();

        expect(Linking.canOpenURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        expect(Linking.openURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        // @ts-ignore
        expect(onComplete).toHaveBeenCalledWith(false);
      });
    });
  });
});
