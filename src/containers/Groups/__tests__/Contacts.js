import React from 'react';

import Contacts from '../Contacts';
import { testSnapshotShallow } from '../../../../testUtils';

it('should render correctly', () => {
  testSnapshotShallow(<Contacts />);
});
