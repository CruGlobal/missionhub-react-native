import React from 'react';

import Members from '../Members';
import { createMockStore, testSnapshotShallow } from '../../../../testUtils';

const store = createMockStore({});

it('should render correctly', () => {
  testSnapshotShallow(<Members />, store);
});
