import 'react-native';
import React from 'react';

import SelectMyStepScreen from '../../src/containers/SelectMyStepScreen';
import { createMockNavState, createMockStore, testSnapshotShallow } from '../../testUtils';

jest.mock('react-native-device-info');

const store = createMockStore({
  steps: {
    suggestedForMe: {
      3: [ { id: '1', body: 'test' } ],
      4: [ { id: '2', body: 'test' } ],
      5: [ { id: '3', body: 'test' } ],
    },
  },
  auth: {
    personId: 1234,
  },
  myStageReducer: { stageId: 4 },
});

let enableBackButton;

const test = () => {
  testSnapshotShallow(
    <SelectMyStepScreen
      navigation={createMockNavState({
        onSaveNewSteps: jest.fn(),
        enableBackButton: enableBackButton,
      })}
    />,
    store
  );
};

it('renders correctly with button', () => {
  enableBackButton = true;

  test();
});

it('renders correctly without button', () => {
  enableBackButton = false;

  test();
});
