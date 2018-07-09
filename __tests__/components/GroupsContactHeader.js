import React from 'react';

import GroupsContactHeader from '../../src/components/GroupsContactHeader/index';
import { testSnapshotShallow } from '../../testUtils/index';

it('renders correctly', () => {
  testSnapshotShallow(<GroupsContactHeader />);
});
