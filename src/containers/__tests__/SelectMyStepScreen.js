import 'react-native';
import React from 'react';

import SelectMyStepScreen from '../SelectMyStepScreen';
import {
  createMockNavState,
  createThunkStore,
  renderWithContext,
} from '../../../testUtils';

jest.mock('react-native-device-info');

const myId = '1234';

const state = {
  steps: {
    suggestedForMe: {
      3: [{ id: '1', body: 'test' }],
      4: [{ id: '2', body: 'test' }],
      5: [{ id: '3', body: 'test' }],
    },
  },
  auth: {
    person: {
      id: myId,
      user: {},
    },
  },
};

const navProps = {
  enableBackButton: false,
  onboarding: false,
  contactStage: { id: 4 },
};

let enableBackButton;
let isOnboarding;

const test = () => {
  renderWithContext(<SelectMyStepScreen next={jest.fn()} />, {
    navParams: {
      ...navProps,
      enableBackButton,
      onboarding: isOnboarding,
    },
    initialState: { auth: { person: {} } },
  }).snapshot();
};

it('renders correctly with back button', () => {
  enableBackButton = true;

  test();
});

it('renders correctly without back button', () => {
  enableBackButton = false;

  test();
});

it('renders correctly for onboarding', () => {
  enableBackButton = false;
  isOnboarding = true;

  test();
});
