import 'react-native';
import React from 'react';

import { StepsScreen } from '../../src/containers/StepsScreen';
import { testSnapshotShallow } from '../../testUtils';

jest.mock('react-native-device-info');
jest.mock('../../src/utils/common', () => ({
  exists: (v) => typeof v !== 'undefined',
  isAndroid: true,
  isiPhoneX: jest.fn(),
  buildTrackingObj: jest.fn(),
}));

const props = {
  areNotificationsOff: true,
  hasMoreSteps: true,
  reminders: [
    {
      id: 1,
      reminder: true,
    },
  ],
  showNotificationReminder: true,
  showStepBump: true,
  showStepReminderBump: true,
  steps: [
    {
      id: 2,
    },
    {
      id: 3,
    },
  ],
  dispatch: jest.fn(() => Promise.resolve()),
};

it('renders android correctly', () => {
  testSnapshotShallow(
    <StepsScreen
      {...props}
    />
  );
});

it('renders loading on Android correctly', () => {
  testSnapshotShallow(
    <StepsScreen
      {
      ...{
        ...props,
        steps: [],
      }
      }
    />
  );
});
