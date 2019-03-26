/* eslint max-params: 0 */
import moment from 'moment';

import { DAYS_OF_THE_WEEK, REMINDER_RECURRENCES } from '../constants';

const { ONCE, DAILY, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

export function getDate(date, minDate, maxDate, format) {
  if (!date) {
    const now = new Date();
    if (minDate) {
      const _minDate = getDate(minDate);

      if (now < _minDate) {
        return _minDate;
      }
    }

    if (maxDate) {
      const _maxDate = getDate(maxDate);

      if (now > _maxDate) {
        return _maxDate;
      }
    }

    return now;
  }

  if (date instanceof Date) {
    return date;
  }

  return moment(date, format).toDate();
}

export function modeIs24Hour(format) {
  return !format.match(/h|a/);
}

export function reminderToDate({ type, at, on }) {
  //return date of the next reminder the user can expect
  switch (type) {
    case ONCE:
      return new Date(at);
    case DAILY:
      return getDailyReminderDate(type, at);
    case WEEKLY:
      return getWeeklyReminderDate(type, at, on);
    default:
      return undefined;
  }
}

function getDailyReminderDate(type, at) {
  const today = new Date();
  const reminderTime = new Date(at);
  console.log(reminderTime);

  let todayReminder = today;
  todayReminder.setHours(reminderTime.getHours());
  todayReminder.setMinutes(reminderTime.getMinutes());

  return todayReminder - today > 0
    ? todayReminder
    : todayReminder.getDate() + 1;
}

function getWeeklyReminderDate(type, at, on) {
  const today = new Date();
  const reminderTime = new Date(at);

  const todayIndex = today.getDay();
  const reminderIndex = DAYS_OF_THE_WEEK.indexOf(on);

  const thisWeekReminder = today.getDate() + (reminderIndex - todayIndex);
  thisWeekReminder.setHours(reminderTime.getHours());
  thisWeekReminder.setMinutes(reminderTime.getMinutes());

  return thisWeekReminder - today > 0
    ? thisWeekReminder
    : thisWeekReminder.getDate() + 7;
}
