import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { createMockStore } from '../testUtils/index';
import ContactSideMenu from '../src/components/ContactSideMenu';
import { testSnapshotShallow } from '../testUtils';

it('renders Casey menu correctly', () => {
  testSnapshotShallow(
    <ContactSideMenu />,
    createMockStore({
      auth: { personId: 1 },
      stages: { stages: [] },
      profile: {
        visiblePersonInfo: {
          isJean: false,
        },
      },
    }),
  );
});

it('renders Jean menu correctly', () => {
  testSnapshotShallow(
    <ContactSideMenu />,
    createMockStore({
      auth: { personId: 1 },
      stages: { stages: [] },
      profile: {
        visiblePersonInfo: {
          isJean: true,
        },
      },
    }),
  );
});
