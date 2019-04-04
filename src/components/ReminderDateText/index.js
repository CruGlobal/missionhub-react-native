import React from 'react';
import i18n from 'i18next';
import moment from 'moment';

import { Text } from '../common';
import { momentUtc } from '../../utils/common';
import { REMINDER_RECURRENCES } from '../../constants';

import styles from './styles';

function isTomorrow(momentDate) {
  return momentDate.isSame(moment().add(1, 'days'), 'day');
}
function isToday(momentDate) {
  return momentDate.isSame(moment(), 'day');
}
function inNextWeek(momentDate) {
  return momentDate.isBetween(moment(), moment().add(7, 'days'), 'day', '[]');
}

function formatReminder({ reminder_type, next_occurrence_at }) {
  const timeFormat = 'LT';
  const momentDate = momentUtc(next_occurrence_at).local();
  switch (reminder_type) {
    case REMINDER_RECURRENCES.DAILY:
      return `${i18n.t('dates.everyDay')} @ ${momentDate.format(timeFormat)}`;
    case REMINDER_RECURRENCES.WEEKLY:
      return `${i18n.t('dates.every')} ${momentDate.format(
        `dddd @ ${timeFormat}`,
      )}`;
    case REMINDER_RECURRENCES.MONTHLY:
      return `${i18n.t('dates.onceAMonth')} ${momentDate.format(
        `Do @ ${timeFormat}`,
      )}`;
    default:
      break;
  }
  if (isToday(momentDate)) {
    return `${i18n.t('dates.today')} @ ${momentDate.format(timeFormat)}`;
  }
  // Check if yesterday
  if (isTomorrow(momentDate)) {
    return `${i18n.t('dates.tomorrow')} @ ${momentDate.format(timeFormat)}`;
  }
  // Check if within the last week
  if (inNextWeek(momentDate)) {
    return momentDate.format(`dddd @ ${timeFormat}`);
  }
  return momentDate.format(`dddd, MMM D @ ${timeFormat}`);
}

export default function ReminderDateText({ reminder, style, placeholder }) {
  const { next_occurrence_at } = reminder || {};

  return (
    <Text style={[styles.reminderText, style]}>
      {next_occurrence_at
        ? formatReminder(reminder)
        : placeholder || i18n.t('stepReminder:setReminder')}
    </Text>
  );
}
