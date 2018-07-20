import React from 'react';

import MemberContacts from '../../src/containers/MemberContacts';
import { testSnapshotShallow, createMockStore } from '../../testUtils';

const person = {
  id: '1',
  first_name: 'Roge',
  contact_assignments: [],
};
const organization = {
  id: '100',
  name: "Roge's org",
};

const props = {
  person,
  organization,
};

describe('MemberCelebrate', () => {
  it('renders correctly', () => {
    testSnapshotShallow(
      <MemberContacts store={createMockStore()} {...props} />,
    );
  });
});
