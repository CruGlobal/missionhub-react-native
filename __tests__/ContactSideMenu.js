import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { createMockStore } from '../testUtils/index';
import ContactSideMenu from '../src/components/ContactSideMenu';
import { createMockNavState, testSnapshotShallow } from '../testUtils';

const store = createMockStore();

it('renders Casey menu correctly', () => {
  testSnapshotShallow(
    <ContactSideMenu navigation={createMockNavState()} screenProps={{ isJean: false }} />,
    store,
  );
});

it('renders Jean menu correctly', () => {
  testSnapshotShallow(
    <ContactSideMenu navigation={createMockNavState()} screenProps={{ isJean: true }} />,
    store,
  );
});
