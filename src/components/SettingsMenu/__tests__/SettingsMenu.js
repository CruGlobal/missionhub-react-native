import 'react-native';
import React from 'react';

import { createMockStore, testSnapshotShallow } from '../../../../testUtils';

import SettingsMenu from '..';

it('renders correctly', () => {
  const mockState = {
    auth: { isFirstTime: false },
  };
  const store = createMockStore(mockState);
  testSnapshotShallow(<SettingsMenu />, store);
});

it('renders correctly', () => {
  const mockState = {
    auth: { isFirstTime: true },
  };
  const store = createMockStore(mockState);
  testSnapshotShallow(<SettingsMenu />, store);
});
