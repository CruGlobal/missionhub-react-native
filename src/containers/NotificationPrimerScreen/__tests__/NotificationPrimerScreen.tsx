import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { requestNativePermissions } from '../../../actions/notifications';
import { navigatePush } from '../../../actions/navigation';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../../constants';
import { useTrackScreenChange } from '../../../utils/hooks/useTrackScreenChange';

import NotificationPrimerScreen from '..';

const {
  ONBOARDING,
  LOGIN,
  FOCUS_STEP,
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
} = NOTIFICATION_PROMPT_TYPES;

jest.mock('../../../actions/navigation');
jest.mock('react-native-device-info');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/analytics');
jest.mock('../../../utils/hooks/useTrackScreenChange');

const navigatePushResult = { type: 'navigated push' };
const registerResult = { type: 'request permissions' };
const trackActionResult = { type: 'tracked action' };
const onComplete = jest.fn();

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (useTrackScreenChange as jest.Mock).mockClear();
});

describe('notificationTypes', () => {
  let notificationType = '';

  const test = () => {
    renderWithContext(<NotificationPrimerScreen />, {
      navParams: {
        onComplete,
        notificationType,
      },
    }).snapshot();
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

it('tracks screen change on mount', () => {
  renderWithContext(<NotificationPrimerScreen />, {
    navParams: {
      onComplete,
      notificationType: ONBOARDING,
    },
  });

  expect(useTrackScreenChange).toHaveBeenCalledWith(['allow notifications']);
});

describe('notification primer methods', () => {
  const notificationType = '';

  describe('not now button', () => {
    it('calls onComplete and tracks an action', () => {
      const { getByTestId } = renderWithContext(<NotificationPrimerScreen />, {
        navParams: {
          onComplete,
          notificationType,
        },
      });
      fireEvent.press(getByTestId('NotNowButton'));
      expect(onComplete).toHaveBeenCalledWith(false);
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NOT_NOW);
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
        (requestNativePermissions as jest.Mock).mockReturnValue(
          requestPermissionsAccepted,
        );
      });

      const { getByTestId } = renderWithContext(<NotificationPrimerScreen />, {
        navParams: {
          onComplete,
          notificationType,
        },
      });

      it('runs allow', async () => {
        await fireEvent.press(getByTestId('AllowButton'));

        expect(requestNativePermissions).toHaveBeenCalled();
        expect(onComplete).toHaveBeenCalledWith(true);
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
      });
    });

    describe('user denies permissions', () => {
      beforeEach(() => {
        (requestNativePermissions as jest.Mock).mockReturnValue(
          requestPermissionsDenied,
        );
      });

      it('runs allow', async () => {
        const { getByTestId } = renderWithContext(
          <NotificationPrimerScreen />,
          {
            navParams: {
              onComplete,
              notificationType,
            },
          },
        );

        await fireEvent.press(getByTestId('AllowButton'));
        expect(requestNativePermissions).toHaveBeenCalled();
        expect(onComplete).toHaveBeenCalledWith(false);
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
      });
    });
  });
});
