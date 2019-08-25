import React from 'react';
import i18n from 'i18next';
import moment, * as MomentTypes from 'moment';
import { StyleProp, TextStyle } from 'react-native';

import { Text } from '../common';
import { momentUtc } from '../../utils/common';
import { REMINDER_RECURRENCES } from '../../constants';

import styles from './styles';

export interface ReminderType {
  id?: string;
  next_occurrence_at: string;
  reminder_type: string;
}

function isTomorrow(momentDate: MomentTypes.Moment) {
  return momentDate.isSame(moment().add(1, 'days'), 'day');
}
function isToday(momentDate: MomentTypes.Moment) {
  return momentDate.isSame(moment(), 'day');
}
function inNextWeek(momentDate: MomentTypes.Moment) {
  return momentDate.isBetween(moment(), moment().add(7, 'days'), 'day', '[]');
}

function formatReminder({ reminder_type, next_occurrence_at }: ReminderType) {
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

export default function ReminderDateText({
  reminder,
  style,
  placeholder,
}: {
  reminder?: ReminderType;
  style?: StyleProp<TextStyle>;
  placeholder?: string;
}) {
  return (
    <Text style={[styles.reminderText, style]}>
      {reminder && reminder.next_occurrence_at
        ? formatReminder(reminder)
        : placeholder || i18n.t('stepReminder:setReminder')}
    </Text>
  );
}
