import React from 'react';

import { testSnapshotShallow } from '../../testUtils';
import LoadingWheel from '../../src/components/LoadingWheel';

it('renders correctly', () => {
  testSnapshotShallow(<LoadingWheel />);
});
