import React from 'react';

import MemberContacts from '../../src/containers/MemberContacts';
import { testSnapshotShallow, createMockStore } from '../../testUtils';

describe('MemberCelebrate', () => {
  it('renders correctly', () => {
    testSnapshotShallow(<MemberContacts store={createMockStore()} />);
  });
});
