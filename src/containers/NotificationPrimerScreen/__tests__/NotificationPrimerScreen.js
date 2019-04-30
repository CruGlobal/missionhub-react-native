import 'react-native';
import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import NotificationPrimerScreen from '..';

import {
  createMockNavState,
  testSnapshotShallow,
  renderShallow,
} from '../../../../testUtils';
import { requestNativePermissions } from '../../../actions/notifications';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../../constants';

const {
  ONBOARDING,
  LOGIN,
  FOCUS_STEP,
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
} = NOTIFICATION_PROMPT_TYPES;

const mockStore = configureStore([thunk]);
let store;

jest.mock('react-native-device-info');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/analytics');

const registerResult = { type: 'request permissions' };
const trackActionResult = { type: 'tracked action' };

beforeEach(() => {
  trackActionWithoutData.mockReturnValue(trackActionResult);

  store = mockStore();
});

describe('notificationTypes', () => {
  let notificationType = '';

  const test = () => {
    testSnapshotShallow(
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          notificationType,
        })}
      />,
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

describe('notification primer methods', () => {
  let screen;
  let mockComplete;

  beforeEach(() => {
    mockComplete = jest.fn();

    screen = renderShallow(
      <NotificationPrimerScreen
        navigation={{
          state: {
            params: {
              onComplete: mockComplete,
            },
          },
        }}
      />,
      store,
    );
  });

  describe('not now button', () => {
    it('calls onComplete and tracks an action', () => {
      screen
        .childAt(1)
        .childAt(2)
        .childAt(1)
        .props()
        .onPress();

      expect(mockComplete).toHaveBeenCalledWith(false);
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NOT_NOW);
      expect(store.getActions()).toEqual([trackActionResult]);
    });
  });

  describe('allow button', () => {
    const requestPermissionsAccepted = {
      ...registerResult,
      acceptedNotifications: true,
    };
    const requestPermissionsDenied = {
      ...registerResult,
      acceptedNotifications: false,
    };

    describe('user allows permissions', () => {
      beforeEach(() => {
        requestNativePermissions.mockReturnValue(requestPermissionsAccepted);
      });

      it('runs allow', async () => {
        await screen
          .childAt(1)
          .childAt(2)
          .childAt(0)
          .props()
          .onPress();

        expect(requestNativePermissions).toHaveBeenCalled();
        expect(mockComplete).toHaveBeenCalledWith(true);
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
        expect(store.getActions()).toEqual([
          requestPermissionsAccepted,
          trackActionResult,
        ]);
      });
    });

    describe('user denies permissions', () => {
      beforeEach(() => {
        requestNativePermissions.mockReturnValue(requestPermissionsDenied);
      });

      it('runs allow', async () => {
        await screen
          .childAt(1)
          .childAt(2)
          .childAt(0)
          .props()
          .onPress();

        expect(requestNativePermissions).toHaveBeenCalled();
        expect(mockComplete).toHaveBeenCalledWith(false);
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
        expect(store.getActions()).toEqual([
          requestPermissionsDenied,
          trackActionResult,
        ]);
      });
    });
  });
});
