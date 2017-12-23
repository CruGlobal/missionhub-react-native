import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { createMockStore } from '../testUtils/index';
import ContactSideMenu from '../src/components/ContactSideMenu';
import { createMockNavState, testSnapshotShallow } from '../testUtils';

it('renders Casey menu correctly', () => {
  const store = createMockStore({ auth: { hasMinistries: false } });

  testSnapshotShallow(
    <ContactSideMenu navigation={createMockNavState()} />,
    store
  );
});

it('renders Jean menu correctly', () => {
  const store = createMockStore({ auth: { hasMinistries: true } });

  testSnapshotShallow(
    <ContactSideMenu navigation={createMockNavState()} />,
    store
  );
});
