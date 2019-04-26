import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import i18next from 'i18next';

import NotificationPrimerScreen from '..';

import {
  createMockNavState,
  testSnapshot,
  renderShallow,
} from '../../../../testUtils';
import { requestNativePermissions } from '../../../actions/notifications';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS } from '../../../constants';

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

it('renders correctly for onboarding', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          descriptionText: i18next.t(
            'notificationPrimer:onboardingDescription',
          ),
        })}
      />
    </Provider>,
  );
});

it('renders correctly without description passed in', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
        })}
      />
    </Provider>,
  );
});

it('renders correctly for focused step', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          descriptionText: i18next.t('notificationPrimer:focusDescription'),
        })}
      />
    </Provider>,
  );
});

it('renders correctly for after login', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          descriptionText: i18next.t('notificationPrimer:loginDescription'),
        })}
      />
    </Provider>,
  );
});

it('renders correctly for set reminder', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          descriptionText: i18next.t(
            'notificationPrimer:setReminderDescription',
          ),
        })}
      />
    </Provider>,
  );
});

it('renders correctly for join community', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          descriptionText: i18next.t(
            'notificationPrimer:joinCommunityDescription',
          ),
        })}
      />
    </Provider>,
  );
});

it('renders correctly for join challenge', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          descriptionText: i18next.t(
            'notificationPrimer:joinChallengeDescription',
          ),
        })}
      />
    </Provider>,
  );
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
