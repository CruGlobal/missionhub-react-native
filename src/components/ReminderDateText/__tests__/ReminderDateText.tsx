import React from 'react';
import MockDate from 'mockdate';
import moment from 'moment';

import { renderWithContext } from '../../../../testUtils';
import ReminderDateText, { REMINDER_DATE_TEXT_FRAGMENT } from '../';
import * as common from '../../../utils/common';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { ReminderDateText as Reminder } from '../__generated__/ReminderDateText';
import { ReminderTypeEnum } from '../../../../__generated__/globalTypes';

const mockDate = '2019-03-27 12:00:00 PM UTC';
const reminder = mockFragment<Reminder>(REMINDER_DATE_TEXT_FRAGMENT);
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
  renderWithContext(
    <ReminderDateText reminder={null} placeholder="text" />,
  ).snapshot();
});

it('renders without reminder or placeholder correctly', () => {
  renderWithContext(<ReminderDateText reminder={null} />).snapshot();
});

const test = (reminder: Reminder) => {
  renderWithContext(<ReminderDateText reminder={reminder} />);
};
it('renders daily', () => {
  test({
    ...reminder,
    reminderType: ReminderTypeEnum.daily,
    nextOccurrenceAt: '2019-03-27 19:00:00 UTC',
  });
});
it('renders weekly', () => {
  test({
    ...reminder,
    reminderType: ReminderTypeEnum.weekly,
    nextOccurrenceAt: '2019-03-29 19:00:00 UTC',
  });
});
it('renders monthly', () => {
  test({
    ...reminder,
    reminderType: ReminderTypeEnum.monthly,
    nextOccurrenceAt: '2019-03-29 19:00:00 UTC',
  });
});
it('renders once today', () => {
  test({
    ...reminder,
    reminderType: ReminderTypeEnum.once,
    nextOccurrenceAt: '2019-03-27 16:00:00 UTC',
  });
});
it('renders once tomorrow', () => {
  test({
    ...reminder,
    reminderType: ReminderTypeEnum.once,
    nextOccurrenceAt: '2019-03-28 16:00:00 UTC',
  });
});
it('renders once this week', () => {
  test({
    ...reminder,
    reminderType: ReminderTypeEnum.once,
    nextOccurrenceAt: '2019-03-31 12:00:00 UTC',
  });
});
it('renders once next week', () => {
  test({
    ...reminder,
    reminderType: ReminderTypeEnum.once,
    nextOccurrenceAt: '2019-04-04 23:00:00 UTC',
  });
});
it('renders once next month', () => {
  test({
    ...reminder,
    reminderType: ReminderTypeEnum.once,
    nextOccurrenceAt: '2019-04-27 17:00:00 UTC',
  });
});
