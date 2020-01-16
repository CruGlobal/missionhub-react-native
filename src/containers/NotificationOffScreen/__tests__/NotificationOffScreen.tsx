import { Linking } from 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { trackActionWithoutData } from '../../../actions/analytics';
import { navigateBack } from '../../../actions/navigation';
import { requestNativePermissions } from '../../../actions/notifications';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../../constants';

import NotificationOffScreen from '..';

jest.mock('react-native-push-notification');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/notifications');

const {
  ONBOARDING,
  LOGIN,
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
} = NOTIFICATION_PROMPT_TYPES;

let onComplete: jest.Mock;

const APP_SETTINGS_URL = 'app-settings:';

const navigateBackResult = { type: 'navigate back' };
const trackActionResult = { type: 'tracked action' };
const requestPermissionsResult = {
  type: 'request permissions',
  acceptedNotifications: true,
};

beforeEach(() => {
  onComplete = jest.fn();
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (requestNativePermissions as jest.Mock).mockReturnValue(
    requestPermissionsResult,
  );
});

describe('notification types', () => {
  it('renders for ONBOARDING', () => {
    renderWithContext(<NotificationOffScreen />, {
      navParams: {
        notificationType: ONBOARDING,
        onComplete,
      },
    }).snapshot();
  });

  it('renders for LOGIN', () => {
    renderWithContext(<NotificationOffScreen />, {
      navParams: {
        notificationType: LOGIN,
        onComplete,
      },
    }).snapshot();
  });

  it('renders for SET_REMINDER', () => {
    renderWithContext(<NotificationOffScreen />, {
      navParams: {
        notificationType: SET_REMINDER,
        onComplete,
      },
    }).snapshot();
  });

  it('renders for JOIN_COMMUNITY', () => {
    renderWithContext(<NotificationOffScreen />, {
      navParams: {
        notificationType: JOIN_COMMUNITY,
        onComplete,
      },
    }).snapshot();
  });

  it('renders for JOIN_CHALLENGE', () => {
    renderWithContext(<NotificationOffScreen />, {
      navParams: {
        notificationType: JOIN_CHALLENGE,
        onComplete,
      },
    }).snapshot();
  });
});

describe('button methods', () => {
  const declinedPermissionsResult = {
    ...requestPermissionsResult,
    acceptedNotifications: false,
  };

  const next = jest.fn();
  const nextResult = { type: 'next' };

  beforeEach(() => {
    (next as jest.Mock).mockReturnValue(nextResult);
    (global.setTimeout as jest.Mock) = jest.fn((callback: () => void) =>
      callback(),
    );
  });

  describe('not now button', () => {
    beforeEach(() => {
      (requestNativePermissions as jest.Mock).mockReturnValue(
        declinedPermissionsResult,
      );
    });

    it('calls next and tracks an action', async () => {
      const { store, getByTestId } = renderWithContext(
        <NotificationOffScreen next={next} />,
        {
          navParams: {
            notificationType: ONBOARDING,
          },
        },
      );

      await fireEvent.press(getByTestId('notNowButton'));

      expect(requestNativePermissions).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledWith();
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NO_REMINDERS);
      expect(store.getActions()).toEqual([
        declinedPermissionsResult,
        trackActionResult,
        nextResult,
      ]);
    });

    it('calls onComplete and tracks an action', async () => {
      const { store, getByTestId } = renderWithContext(
        <NotificationOffScreen />,
        {
          navParams: {
            notificationType: ONBOARDING,
            onComplete,
          },
        },
      );

      await fireEvent.press(getByTestId('notNowButton'));

      expect(requestNativePermissions).toHaveBeenCalledWith();
      expect(onComplete).toHaveBeenCalledWith(false);
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NO_REMINDERS);
      expect(store.getActions()).toEqual([
        declinedPermissionsResult,
        trackActionResult,
      ]);
    });

    it('navigates back and tracks an action', async () => {
      const { store, getByTestId } = renderWithContext(
        <NotificationOffScreen />,
        {
          navParams: {
            notificationType: ONBOARDING,
          },
        },
      );

      await fireEvent.press(getByTestId('notNowButton'));

      expect(requestNativePermissions).toHaveBeenCalledWith();
      expect(navigateBack).toHaveBeenCalledWith();
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NO_REMINDERS);
      expect(store.getActions()).toEqual([
        declinedPermissionsResult,
        trackActionResult,
        navigateBackResult,
      ]);
    });
  });

  describe('go to settings button', () => {
    beforeEach(() => {
      (requestNativePermissions as jest.Mock).mockReturnValue(
        requestPermissionsResult,
      );
    });

    describe('user enables permissions', () => {
      it('opens settings menu, then calls next when returning', async () => {
        const { store, getByTestId } = renderWithContext(
          <NotificationOffScreen next={next} />,
          {
            navParams: {
              notificationType: ONBOARDING,
            },
          },
        );

        await fireEvent.press(getByTestId('allowButton'));

        expect(Linking.canOpenURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        expect(Linking.openURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        expect(requestNativePermissions).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledWith();
        expect(store.getActions()).toEqual([
          requestPermissionsResult,
          nextResult,
        ]);
      });

      it('opens settings menu, then calls onComplete when returning', async () => {
        const { store, getByTestId } = renderWithContext(
          <NotificationOffScreen />,
          {
            navParams: {
              notificationType: ONBOARDING,
              onComplete,
            },
          },
        );

        await fireEvent.press(getByTestId('allowButton'));

        expect(Linking.canOpenURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        expect(Linking.openURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        expect(requestNativePermissions).toHaveBeenCalledWith();
        expect(onComplete).toHaveBeenCalledWith(true);
        expect(store.getActions()).toEqual([requestPermissionsResult]);
      });

      it('opens settings menu, then navigates back', async () => {
        const { store, getByTestId } = renderWithContext(
          <NotificationOffScreen />,
          {
            navParams: {
              notificationType: ONBOARDING,
            },
          },
        );

        await fireEvent.press(getByTestId('allowButton'));

        expect(Linking.canOpenURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        expect(Linking.openURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        expect(requestNativePermissions).toHaveBeenCalledWith();
        expect(navigateBack).toHaveBeenCalledWith();
        expect(store.getActions()).toEqual([
          requestPermissionsResult,
          navigateBackResult,
        ]);
      });
    });

    describe('user does not enable permissions', () => {
      beforeEach(() => {
        (requestNativePermissions as jest.Mock).mockReturnValue(
          declinedPermissionsResult,
        );
      });

      it('opens settings menu, then calls onComplete when returning', async () => {
        const { store, getByTestId } = renderWithContext(
          <NotificationOffScreen />,
          {
            navParams: {
              notificationType: ONBOARDING,
              onComplete,
            },
          },
        );

        await fireEvent.press(getByTestId('allowButton'));

        expect(Linking.canOpenURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        expect(Linking.openURL).toHaveBeenCalledWith(APP_SETTINGS_URL);
        expect(requestNativePermissions).toHaveBeenCalledWith();
        expect(onComplete).toHaveBeenCalledWith(false);
        expect(store.getActions()).toEqual([requestPermissionsResult]);
      });
    });
  });
});
