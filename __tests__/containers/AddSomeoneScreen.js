import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import AddSomeoneScreen from '../../src/containers/AddSomeoneScreen';
import { createMockStore } from '../../testUtils/index';
import { testSnapshotShallow } from '../../testUtils';

const store = createMockStore();

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshotShallow(
    <AddSomeoneScreen />,
    store
  );
});
