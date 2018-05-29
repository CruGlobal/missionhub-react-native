import React from 'react';

import Members from '../Members';
import { testSnapshotShallow } from '../../../../testUtils';

it('should render correctly', () => {
  testSnapshotShallow(<Members />);
});
