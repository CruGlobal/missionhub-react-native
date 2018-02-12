import React from 'react';
import AddContactFields from '../../src/containers/AddContactFields';
import { createMockStore } from '../../testUtils/index';
import { testSnapshotShallow } from '../../testUtils';

const store = createMockStore();

it('renders casey view correctly', () => {
  testSnapshotShallow(
    <AddContactFields person={{
      email_addresses: [],
      phone_numbers: [],
    }} />,
    store
  );
});

it('renders jean view correctly', () => {
  testSnapshotShallow(
    <AddContactFields isJean={true} person={{
      email_addresses: [],
      phone_numbers: [],
    }} />,
    store
  );
});
