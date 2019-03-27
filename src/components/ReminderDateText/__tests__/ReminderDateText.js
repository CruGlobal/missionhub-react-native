import React from 'react';

import { testSnapshotShallow } from '../../../../testUtils/index';
import ReminderDateText from '../';
import { REMINDER_RECURRENCES } from '../../../constants';

const reminder = {
  id: '1',
  type: REMINDER_RECURRENCES.ONCE,
  at: '2019-3-27T00:00:00',
};

it('renders correctly', () => {
  testSnapshotShallow(<ReminderDateText reminder={reminder} />);
});
