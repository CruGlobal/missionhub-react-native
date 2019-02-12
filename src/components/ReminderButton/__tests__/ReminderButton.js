import React from 'react';

import { testSnapshotShallow } from '../../../../testUtils/index';

import ReminderButton from '..';

it('renders correctly', () => {
  testSnapshotShallow(<ReminderButton />);
});
