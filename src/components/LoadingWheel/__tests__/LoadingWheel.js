import React from 'react';

import { testSnapshotShallow } from '../../../../testUtils';

import LoadingWheel from '..';

it('renders correctly', () => {
  testSnapshotShallow(<LoadingWheel />);
});
