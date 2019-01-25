import 'react-native';
import React from 'react';

import SelectMyStepScreen from '../SelectMyStepScreen';
import {
  createMockNavState,
  createMockStore,
  testSnapshotShallow,
  renderShallow,
} from '../../../testUtils';

jest.mock('react-native-device-info');

const store = createMockStore({
  steps: {
    suggestedForMe: {
      3: [{ id: '1', body: 'test' }],
      4: [{ id: '2', body: 'test' }],
      5: [{ id: '3', body: 'test' }],
    },
  },
  auth: {
    person: {
      id: '1234',
      user: {},
    },
  },
});

const mockSaveSteps = jest.fn();
const mockNext = jest.fn();

const navProps = {
  onSaveNewSteps: mockSaveSteps,
  enableBackButton: false,
  onboarding: false,
  contactStage: { id: 4 },
};

let enableBackButton;
let isOnboarding;

const test = () => {
  testSnapshotShallow(
    <SelectMyStepScreen
      navigation={createMockNavState({
        ...navProps,
        enableBackButton,
        onboarding: isOnboarding,
      })}
    />,
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

describe('SelectMyStepScreen methods', () => {
  describe('handleNavigate', () => {
    it('runs onSaveNewSteps', () => {
      const screen = renderShallow(
        <SelectMyStepScreen navigation={createMockNavState(navProps)} />,
        store,
      );

      screen.props().onComplete();

      expect(mockSaveSteps).toHaveBeenCalledTimes(1);
    });

    it('runs next', () => {
      const screen = renderShallow(
        <SelectMyStepScreen
          navigation={createMockNavState({
            ...navProps,
            onSaveNewSteps: undefined,
            next: mockNext,
          })}
        />,
        store,
      );

      screen.props().onComplete();

      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
