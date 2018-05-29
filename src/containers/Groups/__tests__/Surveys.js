import React from 'react';

import Surveys from '../Surveys';
import { createMockStore, testSnapshotShallow } from '../../../../testUtils';

const store = createMockStore({});

it('should render correctly', () => {
  testSnapshotShallow(<Surveys />, store);
});
