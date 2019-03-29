import React from 'react';
import MockDate from 'mockdate';
import moment from 'moment';

import { testSnapshotShallow } from '../../../../testUtils/index';
import ReminderDateText from '../';
import { REMINDER_RECURRENCES } from '../../../constants';
import * as common from '../../../utils/common';

const mockDate = '2019-03-27 12:00:00 PM UTC';
const reminder = {
  id: '1',
  type: REMINDER_RECURRENCES.ONCE,
  next_occurrence_at: mockDate,
};
MockDate.set(mockDate);
// Need to mock out the `.local()` method from utc dates
common.momentUtc = date => {
  const value = moment.utc(date, 'YYYY-MM-DD HH:mm:ss UTC');
  value.local = () => moment.utc(date, 'YYYY-MM-DD HH:mm:ss UTC');
  return value;
};

it('renders with reminder correctly', () => {
  testSnapshotShallow(<ReminderDateText reminder={reminder} />);
});

it('renders with placeholder correctly', () => {
  testSnapshotShallow(<ReminderDateText placeholder="text" />);
});

it('renders without reminder or placeholder correctly', () => {
  testSnapshotShallow(<ReminderDateText />);
});

const test = reminder => {
  testSnapshotShallow(<ReminderDateText reminder={reminder} />);
};
it('renders daily', () => {
  test({
    type: REMINDER_RECURRENCES.DAILY,
    next_occurrence_at: '2019-03-27 19:00:00 UTC',
  });
});
it('renders weekly', () => {
  test({
    type: REMINDER_RECURRENCES.WEEKLY,
    next_occurrence_at: '2019-03-29 19:00:00 UTC',
  });
});
it('renders monthly', () => {
  test({
    type: REMINDER_RECURRENCES.MONTHLY,
    next_occurrence_at: '2019-03-29 19:00:00 UTC',
  });
});
it('renders once today', () => {
  test({
    type: REMINDER_RECURRENCES.ONCE,
    next_occurrence_at: '2019-03-27 16:00:00 UTC',
  });
});
it('renders once tomorrow', () => {
  test({
    type: REMINDER_RECURRENCES.ONCE,
    next_occurrence_at: '2019-03-28 16:00:00 UTC',
  });
});
it('renders once this week', () => {
  test({
    type: REMINDER_RECURRENCES.ONCE,
    next_occurrence_at: '2019-03-31 12:00:00 UTC',
  });
});
it('renders once next week', () => {
  test({
    type: REMINDER_RECURRENCES.ONCE,
    next_occurrence_at: '2019-04-04 23:00:00 UTC',
  });
});
it('renders once next month', () => {
  test({
    type: REMINDER_RECURRENCES.ONCE,
    next_occurrence_at: '2019-04-27 17:00:00 UTC',
  });
});
