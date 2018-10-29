import 'react-native';
import React from 'react';

import { createMockStore, testSnapshotShallow } from '../../../../testUtils';

import SettingsMenu from '..';

const mockState = {
  auth: { isFirstTime: false },
};

const store = createMockStore(mockState);
it('renders correctly', () => {
  testSnapshotShallow(<SettingsMenu />, store);
});
