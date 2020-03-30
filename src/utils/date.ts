import moment from 'moment';
import i18n from 'i18next';

import { ReminderTypeEnum } from '../../__generated__/globalTypes';
import { ReminderDateText as Reminder } from '../components/ReminderDateText/__generated__/ReminderDateText';

import { momentUtc } from './common';

export type dateFormat =
  | 'LT'
  | 'LL'
  | 'LLL'
  | 'ddd, lll'
  | 'dddd'
  | 'dddd, LL'
  | 'dddd @ LT'
  | 'dddd, MMMM D'
  | 'dddd, MMMM D YYYY'
  | 'MMM D @ LT'
  | 'LL @ LT';

// @ts-ignore
export function getDate(date) {
  if (!date) {
    return new Date();
  }

  if (date instanceof Date) {
    return date;
  }

  return moment(date).toDate();
}

// @ts-ignore
export function modeIs24Hour(format) {
  return !!format.match(/H|k/);
}

export function getMomentDate(date: string | Date | undefined) {
  if (typeof date === 'string' && date.indexOf('UTC') >= 0) {
    return momentUtc(date).local();
  }
  return moment(date);
}

const isYesterday = (momentDate: moment.Moment) =>
  momentDate.isSame(moment().subtract(1, 'days'), 'day');

const isToday = (momentDate: moment.Moment) =>
  momentDate.isSame(moment(), 'day');

const isTomorrow = (momentDate: moment.Moment) =>
  momentDate.isSame(moment().add(1, 'days'), 'day');

const inLastWeek = (momentDate: moment.Moment) =>
  momentDate.isBetween(moment().subtract(7, 'days'), moment(), 'day', '[]');

const inNextWeek = (momentDate: moment.Moment) =>
  momentDate.isBetween(moment(), moment().add(7, 'days'), 'day', '[]');

const inThisYear = (momentDate: moment.Moment) =>
  momentDate.isSame(moment(), 'year');

export const commentDateFormat = (date: moment.Moment) =>
  isToday(date)
    ? date.format('LT')
    : isYesterday(date)
    ? `${date.calendar().split(' ')[0]} @ ${date.format('LT')}`
    : inLastWeek(date)
    ? date.format('dddd @ LT')
    : inThisYear(date)
    ? date.format('MMM D @ LT')
    : date.format('LL @ LT');

export const relativeDateFormat = (date: moment.Moment) =>
  isToday(date)
    ? date.calendar().split(' ')[0]
    : isYesterday(date)
    ? date.calendar().split(' ')[0]
    : inLastWeek(date)
    ? date.format('dddd')
    : inThisYear(date)
    ? date.format('dddd, MMMM D')
    : date.format('dddd, MMMM D YYYY');

export const reminderFormat = ({
  reminderType,
  nextOccurrenceAt,
}: Reminder) => {
  const timeFormat = 'LT';
  const momentDate = momentUtc(nextOccurrenceAt).local();

  switch (reminderType) {
    case ReminderTypeEnum.daily:
      return `${i18n.t('dates.everyDay')} @ ${momentDate.format('LT')}`;
    case ReminderTypeEnum.weekly:
      return `${i18n.t('dates.every')} ${momentDate.format('dddd @ LT')}`;
    case ReminderTypeEnum.monthly:
      return `${i18n.t('dates.onceAMonth')} ${momentDate.format(
        `Do @ ${timeFormat}`,
      )}`;
    default:
      break;
  }
  if (isToday(momentDate)) {
    return `${i18n.t('dates.today')} @ ${momentDate.format('LT')}`;
  }
  // Check if tomorrow
  if (isTomorrow(momentDate)) {
    return `${i18n.t('dates.tomorrow')} @ ${momentDate.format('LT')}`;
  }
  // Check if within the last week
  if (inNextWeek(momentDate)) {
    return momentDate.format('dddd @ LT');
  }
  return momentDate.format('dddd, MMM D @ LT');
};
