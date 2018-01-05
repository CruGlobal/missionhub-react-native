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
  },
  notifications: {
    token: '',
    hasAsked: false,
    shouldAsk: true,
    showReminder: true,
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');
jest.mock('../../src/utils/common', () => ({
  exists: (v) => typeof v !== 'undefined',
  isAndroid: true,
}));

it('renders android correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <StepsScreen />
    </Provider>
  );
});