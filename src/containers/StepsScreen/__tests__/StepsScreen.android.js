import 'react-native';
import React from 'react';

import { testSnapshotShallow } from '../../../../testUtils';

import { StepsScreen } from '..';

jest.mock('react-native-device-info');
jest.mock('../../../utils/common', () => ({
  exists: v => typeof v !== 'undefined',
  isAndroid: true,
  buildTrackingObj: jest.fn(),
}));
jest.mock('../../TrackTabChange', () => () => null);

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
  testSnapshotShallow(<StepsScreen {...props} />);
});

it('renders loading on Android correctly', () => {
  testSnapshotShallow(
    <StepsScreen
      {...{
        ...props,
        steps: null,
      }}
    />,
  );
});
