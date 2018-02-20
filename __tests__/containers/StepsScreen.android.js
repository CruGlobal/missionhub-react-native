import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import StepsScreen from '../../src/containers/StepsScreen';
import { testSnapshot } from '../../testUtils';

const mockState = {
  auth: {
    personId: '',
  },
  steps: {
    mine: [],
    suggestedForMe: [],
    suggestedForOthers: [],
    reminders: [],
    pagination: {
      hasNextPage: false,
    },
  },
  notifications: {
    token: '',
    hasAsked: false,
    shouldAsk: true,
    showReminder: true,
  },
  swipe: {
    stepsHome: true,
    stepsReminder: true,
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');
jest.mock('../../src/utils/common', () => ({
  exists: (v) => typeof v !== 'undefined',
  isAndroid: true,
  isiPhoneX: jest.fn(),
  buildTrackingObj: jest.fn(),
}));

it('renders android correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <StepsScreen />
    </Provider>
  );
});
