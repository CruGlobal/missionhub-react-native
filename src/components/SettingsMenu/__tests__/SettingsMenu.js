import 'react-native';
import React from 'react';

import { createMockStore, testSnapshotShallow } from '../../../../testUtils';

import SettingsMenu from '..';

it('renders correctly for authenticated user', () => {
  const mockState = {
    auth: { isFirstTime: false },
  };
  const store = createMockStore(mockState);
  testSnapshotShallow(<SettingsMenu />, store);
});

it('renders correctly for try it now user', () => {
  const mockState = {
    auth: { isFirstTime: true },
  };
  const store = createMockStore(mockState);
  testSnapshotShallow(<SettingsMenu />, store);
});
