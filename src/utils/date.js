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
  const reminderTime = moment(at, 'HH:mm:ss').toDate();

  let reminderDate = new Date();
  reminderDate.setHours(reminderTime.getHours());
  reminderDate.setMinutes(reminderTime.getMinutes());

  if (reminderDate - today > 0) {
    return reminderDate;
  }

  reminderDate.setDate(reminderDate.getDate() + 1);
  return reminderDate;
}

function getWeeklyReminderDate(type, at, on) {
  const today = new Date();
  const reminderTime = moment(at, 'HH:mm:ss').toDate();

  const todayIndex = today.getDay();
  const reminderIndex = DAYS_OF_THE_WEEK.indexOf(on);

  const reminderDate = new Date();
  reminderDate.setDate(reminderDate.getDate() + (reminderIndex - todayIndex));
  reminderDate.setHours(reminderTime.getHours());
  reminderDate.setMinutes(reminderTime.getMinutes());
  console.log(`${today} , ${reminderDate}`);

  if (reminderDate - today > 0) {
    return reminderDate;
  }

  reminderDate.setDate(reminderDate.getDate() + 7);
  return reminderDate;
}
