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
    isJean: false,
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
  swipe: {
    stepsHome: true,
    stepsReminder: true,
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly as Casey', () => {
  testSnapshot(
    <Provider store={store}>
      <StepsScreen />
    </Provider>
  );
});

it('renders correctly as Jean', () => {
  store.getState().auth.isJean = true;

  testSnapshot(
    <Provider store={store}>
      <StepsScreen />
    </Provider>
  );
});