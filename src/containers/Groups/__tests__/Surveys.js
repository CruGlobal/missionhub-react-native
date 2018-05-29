import React from 'react';

import Surveys from '../Surveys';
import { createMockStore, testSnapshotShallow } from '../../../../testUtils';

const store = createMockStore({});

const organization = { id: '1', name: 'Test Org' };

it('should render correctly', () => {
  testSnapshotShallow(<Surveys organization={organization} />, store);
});
