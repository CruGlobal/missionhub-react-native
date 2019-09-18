import React from 'react';
import MockDate from 'mockdate';
import moment from 'moment';

import { renderWithContext } from '../../../../testUtils';
import ReminderDateText, { ReminderType } from '../';
import { REMINDER_RECURRENCES } from '../../../constants';
import * as common from '../../../utils/common';

const mockDate = '2019-03-27 12:00:00 PM UTC';
const reminder = {
  id: '1',
  reminder_type: REMINDER_RECURRENCES.ONCE,
  next_occurrence_at: mockDate,
};
MockDate.set(mockDate);

// Need to mock out the `.local()` method from utc dates
(common.momentUtc as jest.Mock) = jest.fn(date => {
  const value = moment.utc(date, 'YYYY-MM-DD HH:mm:ss UTC');
  value.local = () => moment.utc(date, 'YYYY-MM-DD HH:mm:ss UTC');
  return value;
});

it('renders with reminder correctly', () => {
  renderWithContext(<ReminderDateText reminder={reminder} />).snapshot();
});

it('renders with placeholder correctly', () => {
  renderWithContext(<ReminderDateText placeholder="text" />).snapshot();
});

it('renders without reminder or placeholder correctly', () => {
  renderWithContext(<ReminderDateText />).snapshot();
});

const test = (reminder: ReminderType) => {
  renderWithContext(<ReminderDateText reminder={reminder} />);
};
it('renders daily', () => {
  test({
    reminder_type: REMINDER_RECURRENCES.DAILY,
    next_occurrence_at: '2019-03-27 19:00:00 UTC',
  });
});
it('renders weekly', () => {
  test({
    reminder_type: REMINDER_RECURRENCES.WEEKLY,
    next_occurrence_at: '2019-03-29 19:00:00 UTC',
  });
});
it('renders monthly', () => {
  test({
    reminder_type: REMINDER_RECURRENCES.MONTHLY,
    next_occurrence_at: '2019-03-29 19:00:00 UTC',
  });
});
it('renders once today', () => {
  test({
    reminder_type: REMINDER_RECURRENCES.ONCE,
    next_occurrence_at: '2019-03-27 16:00:00 UTC',
  });
});
it('renders once tomorrow', () => {
  test({
    reminder_type: REMINDER_RECURRENCES.ONCE,
    next_occurrence_at: '2019-03-28 16:00:00 UTC',
  });
});
it('renders once this week', () => {
  test({
    reminder_type: REMINDER_RECURRENCES.ONCE,
    next_occurrence_at: '2019-03-31 12:00:00 UTC',
  });
});
it('renders once next week', () => {
  test({
    reminder_type: REMINDER_RECURRENCES.ONCE,
    next_occurrence_at: '2019-04-04 23:00:00 UTC',
  });
});
it('renders once next month', () => {
  test({
    reminder_type: REMINDER_RECURRENCES.ONCE,
    next_occurrence_at: '2019-04-27 17:00:00 UTC',
  });
});
