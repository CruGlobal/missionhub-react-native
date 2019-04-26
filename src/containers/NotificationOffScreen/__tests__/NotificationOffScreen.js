import { Linking } from 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import PushNotification from 'react-native-push-notification';

import { renderShallow } from '../../../../testUtils';

import NotificationOffScreen from '..';

import { trackActionWithoutData } from '../../../actions/analytics';
import { navigateBack } from '../../../actions/navigation';
import { ACTIONS } from '../../../constants';

jest.mock('react-native-push-notification');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const mockStore = configureStore();
const APP_SETTINGS_URL = 'app-settings:';
let store;
let screen;
let onComplete;

const navigateResult = { type: 'navigated back' };
const trackActionResult = { type: 'tracked action' };
const disabledPermissions = { alert: 0 };
const enabledPermissions = { alert: 1 };

beforeEach(() => {
  store = mockStore();
  onComplete = jest.fn();
  global.setTimeout = jest.fn(callback => callback());

  screen = renderShallow(
    <NotificationOffScreen
      navigation={{ state: {} }}
      onComplete={onComplete}
    />,
    store,
  );

  trackActionWithoutData.mockReturnValue(trackActionResult);
  navigateBack.mockReturnValue(navigateResult);
});

it('renders', () => {
  expect(screen).toMatchSnapshot();
});

describe('not now button', () => {
  beforeEach(() => {
    PushNotification.checkPermissions.mockImplementation(callback =>
      callback(disabledPermissions),
    );
  });

  it('calls onComplete and tracks an action', () => {
    screen
      .childAt(1)
      .childAt(2)
      .childAt(1)
      .props()
      .onPress();

    expect(onComplete).toHaveBeenCalledWith(false);
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NO_REMINDERS);
    expect(store.getActions()).toEqual([trackActionResult]);
  });
});

describe('go to settings button', () => {
  beforeEach(() => {
    jest.mock('react-native');
  });

  describe('user enables permissions', () => {
    beforeEach(() => {
      PushNotification.checkPermissions.mockImplementation(callback =>
        callback(enabledPermissions),
      );
    });

    it('opens settings menu, then calls onComplete when returning', async () => {
      await screen
        .childAt(1)
        .childAt(2)
        .childAt(0)
        .props()
        .onPress();

      expect(Linking.canOpenURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
      expect(Linking.openURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
      expect(onComplete).toHaveBeenCalledWith(true);
    });
  });

  describe('user does not enable permissions', () => {
    beforeEach(() => {
      PushNotification.checkPermissions.mockImplementation(callback =>
        callback(disabledPermissions),
      );
    });

    it('opens settings menu, then calls onComplete when returning', async () => {
      await screen
        .childAt(1)
        .childAt(2)
        .childAt(0)
        .props()
        .onPress();

      expect(Linking.canOpenURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
      expect(Linking.openURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
      expect(onComplete).toHaveBeenCalledWith(false);
    });
  });
});
