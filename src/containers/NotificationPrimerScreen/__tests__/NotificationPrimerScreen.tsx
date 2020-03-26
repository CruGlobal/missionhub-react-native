import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import {
  requestNativePermissions,
  hasShownPrompt,
} from '../../../actions/notifications';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../../constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import NotificationPrimerScreen from '..';

const {
  ONBOARDING,
  LOGIN,
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
} = NOTIFICATION_PROMPT_TYPES;

jest.mock('../../../actions/navigation');
jest.mock('react-native-device-info');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/analytics');
jest.mock('../../../utils/hooks/useAnalytics');

let onComplete: jest.Mock;
const next = jest.fn();

const navigatePushResult = { type: 'navigated push' };
const navigateBackResult = { type: 'navigated back' };
const trackActionResult = { type: 'tracked action' };
const hasShownPromptResult = { type: 'has shown prompt' };
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
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (hasShownPrompt as jest.Mock).mockReturnValue(hasShownPromptResult);
  (next as jest.Mock).mockReturnValue(nextResult);
});

describe('notificationTypes', () => {
  it('renders for ONBOARDING', () => {
    renderWithContext(<NotificationPrimerScreen />, {
      navParams: {
        onComplete,
        notificationType: ONBOARDING,
      },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('allow notifications');
  });

  it('renders for LOGIN', () => {
    renderWithContext(<NotificationPrimerScreen />, {
      navParams: {
        onComplete,
        notificationType: LOGIN,
      },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('allow notifications');
  });

  it('renders for SET_REMINDER', () => {
    renderWithContext(<NotificationPrimerScreen />, {
      navParams: {
        onComplete,
        notificationType: SET_REMINDER,
      },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('allow notifications');
  });

  it('renders for JOIN_COMMUNITY', () => {
    renderWithContext(<NotificationPrimerScreen />, {
      navParams: {
        onComplete,
        notificationType: JOIN_COMMUNITY,
      },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('allow notifications');
  });

  it('renders for JOIN_CHALLENGE', () => {
    renderWithContext(<NotificationPrimerScreen />, {
      navParams: {
        onComplete,
        notificationType: JOIN_CHALLENGE,
      },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('allow notifications');
  });
});

describe('notification primer methods', () => {
  describe('not now button', () => {
    it('calls next and tracks an action', () => {
      const { store, getByTestId } = renderWithContext(
        <NotificationPrimerScreen next={next} />,
        {
          navParams: {
            notificationType: ONBOARDING,
          },
        },
      );

      fireEvent.press(getByTestId('NotNowButton'));

      expect(next).toHaveBeenCalledWith();
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NOT_NOW);
      expect(store.getActions()).toEqual([nextResult, trackActionResult]);
    });

    it('calls onComplete and tracks an action', () => {
      const { store, getByTestId } = renderWithContext(
        <NotificationPrimerScreen />,
        {
          navParams: {
            onComplete,
            notificationType: ONBOARDING,
          },
        },
      );

      fireEvent.press(getByTestId('NotNowButton'));

      expect(onComplete).toHaveBeenCalledWith({
        nativePermissionsEnabled: false,
        showedPrompt: true,
      });
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NOT_NOW);
      expect(store.getActions()).toEqual([trackActionResult]);
    });

    it('navigates back and tracks an action', () => {
      const { store, getByTestId } = renderWithContext(
        <NotificationPrimerScreen />,
        {
          navParams: {
            notificationType: ONBOARDING,
          },
        },
      );

      fireEvent.press(getByTestId('NotNowButton'));

      expect(navigateBack).toHaveBeenCalledWith();
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NOT_NOW);
      expect(store.getActions()).toEqual([
        navigateBackResult,
        trackActionResult,
      ]);
    });
  });

  describe('allow button', () => {
    describe('user allows permissions', () => {
      beforeEach(() => {
        (requestNativePermissions as jest.Mock).mockReturnValue(
          requestPermissionsAccepted,
        );
      });

      it('allows permissions and calls next', async () => {
        const { store, getByTestId } = renderWithContext(
          <NotificationPrimerScreen next={next} />,
          {
            navParams: {
              notificationType: ONBOARDING,
            },
          },
        );

        await fireEvent.press(getByTestId('AllowButton'));

        expect(hasShownPrompt).toHaveBeenCalledWith();
        expect(requestNativePermissions).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith();
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
        expect(store.getActions()).toEqual([
          hasShownPromptResult,
          requestPermissionsAccepted,
          nextResult,
          trackActionResult,
        ]);
      });

      it('allows permissions and calls onComplete', async () => {
        const { store, getByTestId } = renderWithContext(
          <NotificationPrimerScreen />,
          {
            navParams: {
              onComplete,
              notificationType: ONBOARDING,
            },
          },
        );

        await fireEvent.press(getByTestId('AllowButton'));

        expect(hasShownPrompt).toHaveBeenCalledWith();
        expect(requestNativePermissions).toHaveBeenCalled();
        expect(onComplete).toHaveBeenCalledWith({
          nativePermissionsEnabled: true,
          showedPrompt: true,
        });
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
        expect(store.getActions()).toEqual([
          hasShownPromptResult,
          requestPermissionsAccepted,
          trackActionResult,
        ]);
      });

      it('allows permissions and navigates back', async () => {
        const { store, getByTestId } = renderWithContext(
          <NotificationPrimerScreen />,
          {
            navParams: {
              notificationType: ONBOARDING,
            },
          },
        );

        await fireEvent.press(getByTestId('AllowButton'));

        expect(hasShownPrompt).toHaveBeenCalledWith();
        expect(requestNativePermissions).toHaveBeenCalled();

        expect(navigateBack).toHaveBeenCalledWith();
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
        expect(store.getActions()).toEqual([
          hasShownPromptResult,
          requestPermissionsAccepted,
          navigateBackResult,
          trackActionResult,
        ]);
      });
    });

    describe('user denies permissions', () => {
      beforeEach(() => {
        (requestNativePermissions as jest.Mock).mockReturnValue(
          requestPermissionsDenied,
        );
      });

      it('allows permissions and calls next', async () => {
        const { store, getByTestId } = renderWithContext(
          <NotificationPrimerScreen next={next} />,
          {
            navParams: {
              notificationType: ONBOARDING,
            },
          },
        );

        await fireEvent.press(getByTestId('AllowButton'));

        expect(hasShownPrompt).toHaveBeenCalledWith();
        expect(requestNativePermissions).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith();
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
        expect(store.getActions()).toEqual([
          hasShownPromptResult,
          requestPermissionsDenied,
          nextResult,
          trackActionResult,
        ]);
      });

      it('allows permissions and calls onComplete', async () => {
        const { store, getByTestId } = renderWithContext(
          <NotificationPrimerScreen />,
          {
            navParams: {
              onComplete,
              notificationType: ONBOARDING,
            },
          },
        );

        await fireEvent.press(getByTestId('AllowButton'));

        expect(hasShownPrompt).toHaveBeenCalledWith();
        expect(requestNativePermissions).toHaveBeenCalled();
        expect(onComplete).toHaveBeenCalledWith({
          nativePermissionsEnabled: false,
          showedPrompt: true,
        });
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
        expect(store.getActions()).toEqual([
          hasShownPromptResult,
          requestPermissionsDenied,
          trackActionResult,
        ]);
      });

      it('allows permissions and navigates back', async () => {
        const { store, getByTestId } = renderWithContext(
          <NotificationPrimerScreen />,
          {
            navParams: {
              notificationType: ONBOARDING,
            },
          },
        );

        await fireEvent.press(getByTestId('AllowButton'));

        expect(hasShownPrompt).toHaveBeenCalledWith();
        expect(requestNativePermissions).toHaveBeenCalled();
        expect(navigateBack).toHaveBeenCalledWith();
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
        expect(store.getActions()).toEqual([
          hasShownPromptResult,
          requestPermissionsDenied,
          navigateBackResult,
          trackActionResult,
        ]);
      });
    });
  });
});
