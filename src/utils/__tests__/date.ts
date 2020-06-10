import moment from 'moment';
import MockDate from 'mockdate';

import { ReminderDateText } from '../../components/ReminderDateText/__generated__/ReminderDateText';
import {
  getDate,
  modeIs24Hour,
  formatApiDate,
  isLastTwentyFourHours,
  getMomentDate,
  dateAtTimeFormat,
  reminderFormat,
} from '../date';
import { ReminderTypeEnum } from '../../../__generated__/globalTypes';

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);

describe('getDate', () => {
  it('formats date string', () => {
    expect(getDate(mockDate)).toEqual(moment(mockDate).toDate());
  });

  it('returns Date instance as is', () => {
    const date = new Date();
    expect(getDate(date)).toEqual(date);
  });
});

describe('isLastTwentyFourHours', () => {
  it('returns true for date that was in the last twenty four hours', () => {
    expect(isLastTwentyFourHours(getMomentDate(mockDate))).toEqual(true);
  });
  it('returns false for date past twenty four hours', () => {
    const date = getMomentDate('2018-09-10 11:00:00 AM GMT+0');
    expect(isLastTwentyFourHours(date)).toEqual(false);
  });
});

describe('modeIs24Hour', () => {
  it('format has h', () => {
    expect(modeIs24Hour('hh:mm')).toEqual(false);
  });

  it('format has a', () => {
    expect(modeIs24Hour('aa')).toEqual(false);
  });

  it('format has neither h nor a', () => {
    expect(modeIs24Hour('HH:mm')).toEqual(true);
  });
});

describe('formatAPIDate', () => {
  // eslint-disable-next-line
  expect(formatApiDate()).toMatchInlineSnapshot(`"2018-09-12T12:00:00+00:00"`);
});

describe('dateAtTimeFormat', () => {
  it('formats for today', () => {
    expect(
      dateAtTimeFormat(getMomentDate('2018-09-12 10:31:00 AM GMT+0')),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"Today @ 10:31 AM"`);
  });

  it('formats for yesterday', () => {
    expect(
      dateAtTimeFormat(getMomentDate('2018-09-11 10:31:00 AM GMT+0')),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"Yesterday @ 10:31 AM"`);
  });

  it('formats for date in last week', () => {
    expect(
      dateAtTimeFormat(getMomentDate('2018-09-09 10:31:00 AM GMT+0')),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"Sunday @ 10:31 AM"`);
  });

  it('formats for date in last year', () => {
    expect(
      dateAtTimeFormat(getMomentDate('2018-08-12 10:31:00 AM GMT+0')),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"August 12 @ 10:31 AM"`);
  });

  it('formats for date in previous years', () => {
    expect(
      dateAtTimeFormat(getMomentDate('2017-09-12 10:31:00 AM GMT+0')),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"September 12, 2017 @ 10:31 AM"`);
  });
});

describe('reminderFormat', () => {
  const reminder: ReminderDateText = {
    __typename: 'StepReminder',
    id: '1',
    reminderType: ReminderTypeEnum.daily,
    nextOccurrenceAt: mockDate,
  };

  it('formats for daily', () => {
    expect(
      reminderFormat({
        ...reminder,
        reminderType: ReminderTypeEnum.daily,
        nextOccurrenceAt: '2018-10-12 10:31:00 AM GMT+0',
      }),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"Every day @ 10:31 AM"`);
  });

  it('formats for weekly', () => {
    expect(
      reminderFormat({
        ...reminder,
        reminderType: ReminderTypeEnum.weekly,
        nextOccurrenceAt: '2018-10-12 10:31:00 AM GMT+0',
      }),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"Every Friday @ 10:31 AM"`);
  });

  it('formats for monthly', () => {
    expect(
      reminderFormat({
        ...reminder,
        reminderType: ReminderTypeEnum.monthly,
        nextOccurrenceAt: '2018-10-12 10:31:00 AM GMT+0',
      }),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"Once a month on the 12th @ 10:31 AM"`);
  });

  it('formats for today', () => {
    expect(
      reminderFormat({
        ...reminder,
        reminderType: ReminderTypeEnum.once,
        nextOccurrenceAt: '2018-09-12 10:31:00 AM GMT+0',
      }),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"Today @ 10:31 AM"`);
  });

  it('formats for tomorrow', () => {
    expect(
      reminderFormat({
        ...reminder,
        reminderType: ReminderTypeEnum.once,
        nextOccurrenceAt: '2018-09-13 10:31:00 AM GMT+0',
      }),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"Tomorrow @ 10:31 AM"`);
  });

  it('formats for date in next week', () => {
    expect(
      reminderFormat({
        ...reminder,
        reminderType: ReminderTypeEnum.once,
        nextOccurrenceAt: '2018-09-15 10:31:00 AM GMT+0',
      }),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"Saturday @ 10:31 AM"`);
  });

  it('formats for date beyond next week', () => {
    expect(
      reminderFormat({
        ...reminder,
        reminderType: ReminderTypeEnum.once,
        nextOccurrenceAt: '2018-10-12 10:31:00 AM GMT+0',
      }),
      // eslint-disable-next-line
    ).toMatchInlineSnapshot(`"Friday, Oct 12 @ 10:31 AM"`);
  });
});
