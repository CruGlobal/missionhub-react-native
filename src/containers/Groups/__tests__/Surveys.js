import React from 'react';

import Surveys from '../Surveys';
import { testSnapshotShallow } from '../../../../testUtils';

it('should render correctly', () => {
  testSnapshotShallow(<Surveys />);
});
