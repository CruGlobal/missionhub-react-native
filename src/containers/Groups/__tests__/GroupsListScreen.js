import React from 'react';

import GroupsListScreen from '../GroupsListScreen';
import { testSnapshotShallow } from '../../../../testUtils';

it('should render correctly', () => {
  testSnapshotShallow(<GroupsListScreen />);
});
