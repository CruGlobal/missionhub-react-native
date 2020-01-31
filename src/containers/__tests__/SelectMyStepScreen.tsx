import 'react-native';
import React from 'react';

import SelectMyStepScreen from '../SelectMyStepScreen';
import {
  createMockNavState,
  createThunkStore,
  testSnapshotShallow,
} from '../../../testUtils';

jest.mock('react-native-device-info');
jest.mock('../../utils/hooks/useAnalytics');

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

// @ts-ignore
let enableBackButton;
// @ts-ignore
let isOnboarding;

// @ts-ignore
let store;

beforeEach(() => {
  store = createThunkStore(state);
});

const test = () => {
  testSnapshotShallow(
    <SelectMyStepScreen
      // @ts-ignore
      navigation={createMockNavState({
        ...navProps,
        // @ts-ignore
        enableBackButton,
        // @ts-ignore
        onboarding: isOnboarding,
      })}
      next={jest.fn()}
    />,
    // @ts-ignore
    store,
  );
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
