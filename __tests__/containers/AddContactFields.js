import React from 'react';

import AddContactFields from '../../src/containers/AddContactFields';
import { createMockStore, testSnapshotShallow } from '../../testUtils';

const store = createMockStore();

it('renders casey view correctly', () => {
  testSnapshotShallow(
    <AddContactFields onUpdateData={() => {}} person={{
      email_addresses: [],
      phone_numbers: [],
    }} />,
    store
  );
});

it('renders jean view correctly', () => {
  testSnapshotShallow(
    <AddContactFields onUpdateData={() => {}} isJean={true} person={{
      email_addresses: [],
      phone_numbers: [],
    }} />,
    store
  );
});
