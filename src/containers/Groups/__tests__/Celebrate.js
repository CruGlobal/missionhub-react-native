import React from 'react';

import Celebrate from '../Celebrate';
import { testSnapshotShallow } from '../../../../testUtils';

it('should render correctly', () => {
  testSnapshotShallow(<Celebrate />);
});
