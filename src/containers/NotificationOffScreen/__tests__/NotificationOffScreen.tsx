/* eslint max-lines: 0 */
import React from 'react';
import { Linking } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useAppState } from 'react-native-hooks';

import { renderWithContext } from '../../../../testUtils';
import { trackActionWithoutData } from '../../../actions/analytics';
import { navigateBack } from '../../../actions/navigation';
import { requestNativePermissions } from '../../../actions/notifications';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../../constants';

import NotificationOffScreen from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/notifications');
jest.mock('react-native-hooks');

const {
  ONBOARDING,
  LOGIN,
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
} = NOTIFICATION_PROMPT_TYPES;

let onComplete: jest.Mock;
const next = jest.fn();

const APP_SETTINGS_URL = 'app-settings:';

const navigateBackResult = { type: 'navigate back' };
const trackActionResult = { type: 'tracked action' };
const requestPermissionsAccepted = {
  type: 'request permissions',
  nativePermissionsEnabled: true,
};
const requestPermissionsDenied = {
  type: 'request permissions',
  nativePermissionsEnabled: false,
};
const nextResult = { type: 'next' };

beforeEach(() => {
  onComplete = jest.fn();
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (next as jest.Mock).mockReturnValue(nextResult);
  (useAppState as jest.Mock).mockReturnValue('active');
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
  describe('not now button', () => {
    beforeEach(() => {
      (requestNativePermissions as jest.Mock).mockReturnValue(
        requestPermissionsDenied,
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
        requestPermissionsDenied,
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
      expect(onComplete).toHaveBeenCalledWith({
        nativePermissionsEnabled: false,
        showedPrompt: true,
      });
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NO_REMINDERS);
      expect(store.getActions()).toEqual([
        requestPermissionsDenied,
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
        requestPermissionsDenied,
        trackActionResult,
        navigateBackResult,
      ]);
    });
  });

  //TODO: Get these tests to work
  describe('go to settings button', () => {
    beforeEach(() => {
      (requestNativePermissions as jest.Mock).mockReturnValue(
        requestPermissionsAccepted,
      );
    });

    describe('user enables permissions', () => {
      it('opens settings menu, then calls next when returning', async () => {
        const { store, getByTestId, rerender } = renderWithContext(
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

        (useAppState as jest.Mock).mockReturnValue('background');
        rerender(<NotificationOffScreen next={next} />);

        await flushMicrotasksQueue();

        (useAppState as jest.Mock).mockReturnValue('active');
        rerender(<NotificationOffScreen next={next} />);

        await flushMicrotasksQueue();

        expect(requestNativePermissions).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledWith();
        expect(store.getActions()).toEqual([
          requestPermissionsAccepted,
          nextResult,
        ]);
      });

      it('opens settings menu, then calls onComplete when returning', async () => {
        const { store, getByTestId, rerender } = renderWithContext(
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

        (useAppState as jest.Mock).mockReturnValue('background');
        rerender(<NotificationOffScreen next={next} />);

        await flushMicrotasksQueue();

        (useAppState as jest.Mock).mockReturnValue('active');
        rerender(<NotificationOffScreen next={next} />);

        await flushMicrotasksQueue();

        expect(requestNativePermissions).toHaveBeenCalledWith();
        expect(onComplete).toHaveBeenCalledWith({
          nativePermissionsEnabled: true,
          showedPrompt: true,
        });
        expect(store.getActions()).toEqual([requestPermissionsAccepted]);
      });

      it('opens settings menu, then navigates back when returning', async () => {
        const { store, getByTestId, rerender } = renderWithContext(
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

        (useAppState as jest.Mock).mockReturnValue('background');
        rerender(<NotificationOffScreen next={next} />);

        await flushMicrotasksQueue();

        (useAppState as jest.Mock).mockReturnValue('active');
        rerender(<NotificationOffScreen next={next} />);

        await flushMicrotasksQueue();

        expect(requestNativePermissions).toHaveBeenCalledWith();
        expect(navigateBack).toHaveBeenCalledWith();
        expect(store.getActions()).toEqual([
          requestPermissionsAccepted,
          navigateBackResult,
        ]);
      });
    });

    describe('user does not enable permissions', () => {
      beforeEach(() => {
        (requestNativePermissions as jest.Mock).mockReturnValue(
          requestPermissionsDenied,
        );
      });

      it('opens settings menu, then calls next when returning', async () => {
        const { store, getByTestId, rerender } = renderWithContext(
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

        (useAppState as jest.Mock).mockReturnValue('background');
        rerender(<NotificationOffScreen next={next} />);

        await flushMicrotasksQueue();

        (useAppState as jest.Mock).mockReturnValue('active');
        rerender(<NotificationOffScreen next={next} />);

        await flushMicrotasksQueue();

        expect(requestNativePermissions).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledWith();
        expect(store.getActions()).toEqual([
          requestPermissionsDenied,
          nextResult,
        ]);
      });

      it('opens settings menu, then calls onComplete when returning', async () => {
        const { store, getByTestId, rerender } = renderWithContext(
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

        (useAppState as jest.Mock).mockReturnValue('background');
        rerender(<NotificationOffScreen next={next} />);

        await flushMicrotasksQueue();

        (useAppState as jest.Mock).mockReturnValue('active');
        rerender(<NotificationOffScreen next={next} />);

        await flushMicrotasksQueue();

        expect(requestNativePermissions).toHaveBeenCalledWith();
        expect(onComplete).toHaveBeenCalledWith({
          nativePermissionsEnabled: false,
          showedPrompt: true,
        });
        expect(store.getActions()).toEqual([requestPermissionsDenied]);
      });

      fit('opens settings menu, then navigates back when returning', async () => {
        const { store, getByTestId, rerender } = renderWithContext(
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

        (useAppState as jest.Mock).mockReturnValue('background');
        rerender(<NotificationOffScreen propToForceSecondRender />);

        (useAppState as jest.Mock).mockReturnValue('active');
        rerender(<NotificationOffScreen propToForceThirdRender />);

        await flushMicrotasksQueue();

        expect(requestNativePermissions).toHaveBeenCalledWith();
        expect(navigateBack).toHaveBeenCalledWith();
        expect(store.getActions()).toEqual([
          requestPermissionsDenied,
          navigateBackResult,
        ]);
      });
    });
  });
});
