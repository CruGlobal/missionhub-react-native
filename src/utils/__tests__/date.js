import moment from 'moment';
import MockDate from 'mockdate';

import { getDate, modeIs24Hour, reminderToDate } from '../date';
import { DAYS_OF_THE_WEEK, REMINDER_RECURRENCES } from '../../constants';

const { ONCE, DAILY, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

const mockDate = '2018-09-12T12:00:00';
const mockMinDate = '2019-10-13T12:00:00';
const mockMaxDate = '2017-08-10T12:00:00';

beforeEach(() => {
  MockDate.set(mockDate);
});

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

      expect(reminderToDate(reminder)).toEqual(new Date(reminder.at));
    });
  });

  describe('daily', () => {
    it('returns reminder for today', () => {
      reminder = { type: DAILY, at: '18:16:00' };
      const reminderTime = moment(reminder.at, 'HH:mm:ss').toDate();
      let reminderDate = new Date();
      reminderDate.setHours(reminderTime.getHours());
      reminderDate.setMinutes(reminderTime.getMinutes());

      expect(reminderToDate(reminder)).toEqual(reminderDate);
    });

    it('returns reminder for tomorrow', () => {
      reminder = { type: DAILY, at: '06:16:00' };
      const reminderTime = moment(reminder.at, 'HH:mm:ss').toDate();
      let reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 1);
      reminderDate.setHours(reminderTime.getHours());
      reminderDate.setMinutes(reminderTime.getMinutes());

      expect(reminderToDate(reminder)).toEqual(reminderDate);
    });
  });

  describe('weekly', () => {
    const mockDateIndex = new Date().getDay();

    it('returns reminder for this week', () => {
      const index = 6;
      reminder = {
        type: WEEKLY,
        at: '18:16:00',
        on: DAYS_OF_THE_WEEK[index],
      };
      const reminderTime = moment(reminder.at, 'HH:mm:ss').toDate();
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + (index - mockDateIndex));
      reminderDate.setHours(reminderTime.getHours());
      reminderDate.setMinutes(reminderTime.getMinutes());

      expect(reminderToDate(reminder)).toEqual(reminderDate);
    });

    it('returns reminder for next week', () => {
      const index = 0;
      reminder = {
        type: WEEKLY,
        at: '06:16:00',
        on: DAYS_OF_THE_WEEK[index],
      };
      const reminderTime = moment(reminder.at, 'HH:mm:ss').toDate();
      const reminderDate = new Date();
      reminderDate.setDate(
        reminderDate.getDate() + (index - mockDateIndex + 7),
      );
      reminderDate.setHours(reminderTime.getHours());
      reminderDate.setMinutes(reminderTime.getMinutes());

      expect(reminderToDate(reminder)).toEqual(reminderDate);
    });
  });
});
