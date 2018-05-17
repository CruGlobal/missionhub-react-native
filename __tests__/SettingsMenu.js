import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { createMockStore } from '../testUtils/index';
import SettingsMenu from '../src/components/SettingsMenu';
import { testSnapshotShallow } from '../testUtils';
const mockState = {
  auth: { isFirstTime: false },
};

const store = createMockStore(mockState);
it('renders correctly', () => {
  testSnapshotShallow(<SettingsMenu />, store);
});
