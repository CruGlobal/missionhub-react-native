import React from 'react';

import MemberContacts from '../../src/containers/MemberContacts';
import { testSnapshotShallow } from '../../testUtils';

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
  it('renders empty', () => {
    testSnapshotShallow(<MemberContacts {...props} />);
  });

  it('renders a list', () => {
    testSnapshotShallow(
      <MemberContacts
        {...props}
        person={{
          ...person,
          contact_assignments: [{ id: '1' }, { id: '2' }, { id: '3' }],
        }}
      />,
    );
  });
});
