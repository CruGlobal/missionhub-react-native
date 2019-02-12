import React from 'react';

import ReminderButton from '../ReminderButton';
import { testSnapshotShallow } from '../../../testUtils';

it('renders correctly', () => {
  testSnapshotShallow(<ReminderButton />);
});
