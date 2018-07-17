import React from 'react';

import MemberCelebrate from '../../src/containers/MemberCelebrate';
import { testSnapshotShallow, createMockStore } from '../../testUtils';

describe('MemberCelebrate', () => {
  it('renders correctly', () => {
    testSnapshotShallow(<MemberCelebrate store={createMockStore()} />);
  });
});
