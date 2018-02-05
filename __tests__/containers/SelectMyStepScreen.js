import 'react-native';
import React from 'react';

import { createMockStore } from '../../testUtils/index';
import SelectMyStepScreen from '../../src/containers/SelectMyStepScreen';
import { testSnapshotShallow } from '../../testUtils';

jest.mock('react-native-device-info');

const store = createMockStore({
  steps: {
    suggestedForMe: [ { id: 1 }, { id: 2 }, { id: 3 } ],
  },
  auth: {
    personId: 1234,
  },
});


it('renders correctly', () => {
  testSnapshotShallow(
    <SelectMyStepScreen />,
    store
  );
});
