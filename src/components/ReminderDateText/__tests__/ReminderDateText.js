import React from 'react';

import { testSnapshotShallow } from '../../../../testUtils/index';
import ReminderDateText from '../';
import { REMINDER_RECURRENCES } from '../../../constants';

const reminder = {
  id: '1',
  type: REMINDER_RECURRENCES.ONCE,
  at: '2019-3-27T00:00:00',
};

it('renders with reminder correctly', () => {
  testSnapshotShallow(<ReminderDateText reminder={reminder} />);
});

it('renders with placeholder correctly', () => {
  testSnapshotShallow(<ReminderDateText placeholder={'text'} />);
});

it('renders without reminder or placeholder correctly', () => {
  testSnapshotShallow(<ReminderDateText />);
});
