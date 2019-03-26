import moment from 'moment';
import MockDate from 'mockdate';

import { getDate, modeIs24Hour, reminderToDate } from '../date';
import { DAYS_OF_THE_WEEK, REMINDER_RECURRENCES } from '../../constants';

const { ONCE, DAILY, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

const mockDate = '2018-09-12T12:00:00+00:00';
const mockMinDate = '2019-10-13T12:00:00+00:00';
const mockMaxDate = '2017-08-10T12:00:00+00:00';
MockDate.set(mockDate);

describe('getDate', () => {
  it('formats date string', () => {
    expect(getDate(mockDate)).toEqual(moment(mockDate).toDate());
  });

  it('returns Date instance as is', () => {
    const date = new Date();
    expect(getDate(date)).toEqual(date);
  });

  it('defaults to min date', () => {
    expect(getDate(undefined, mockMinDate)).toEqual(
      moment(mockMinDate).toDate(),
    );
  });

  it('defaults to max date', () => {
    expect(getDate(undefined, undefined, mockMaxDate)).toEqual(
      moment(mockMaxDate).toDate(),
    );
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

describe('reminderToDate', () => {
  let reminder;

  describe('once', () => {
    it('returns date as is', () => {
      reminder = { type: ONCE, at: '2018-10-23T12:00:00+00:00' };

      expect(reminderToDate(reminder)).toEqual('');
    });
  });

  describe('daily', () => {
    it('returns reminder for today', () => {
      reminder = { type: DAILY, at: '14:00:00' };

      expect(reminderToDate(reminder)).toEqual('');
    });

    it('returns reminder for tomorrow', () => {
      reminder = { type: DAILY, at: '10:00:00' };

      expect(reminderToDate(reminder)).toEqual('');
    });
  });

  describe('weekly', () => {
    it('returns reminder for this week', () => {
      reminder = {
        type: WEEKLY,
        at: '14:00:00',
        on: DAYS_OF_THE_WEEK[6],
      };

      expect(reminderToDate(reminder)).toEqual('');
    });

    it('returns reminder for tomorrow', () => {
      reminder = {
        type: WEEKLY,
        at: '10:00:00',
        on: DAYS_OF_THE_WEEK[0],
      };

      expect(reminderToDate(reminder)).toEqual('');
    });
  });
});
