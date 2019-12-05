import React from 'react';
import i18n from 'i18next';
import moment, * as MomentTypes from 'moment';
import { StyleProp, TextStyle } from 'react-native';
import gql from 'graphql-tag';

import { Text } from '../common';
import { momentUtc } from '../../utils/common';
import { ReminderTypeEnum } from '../../../__generated__/globalTypes';

import { ReminderDateText as Reminder } from './__generated__/ReminderDateText';
import styles from './styles';

export const REMINDER_DATE_TEXT_FRAGMENT = gql`
  fragment ReminderDateText on StepReminder {
    id
    nextOccurrenceAt
    reminderType
  }
`;

function isTomorrow(momentDate: MomentTypes.Moment) {
  return momentDate.isSame(moment().add(1, 'days'), 'day');
}
function isToday(momentDate: MomentTypes.Moment) {
  return momentDate.isSame(moment(), 'day');
}
function inNextWeek(momentDate: MomentTypes.Moment) {
  return momentDate.isBetween(moment(), moment().add(7, 'days'), 'day', '[]');
}

function formatReminder({ reminderType, nextOccurrenceAt }: Reminder) {
  const timeFormat = 'LT';
  const momentDate = momentUtc(nextOccurrenceAt).local();
  switch (reminderType) {
    case ReminderTypeEnum.daily:
      return `${i18n.t('dates.everyDay')} @ ${momentDate.format(timeFormat)}`;
    case ReminderTypeEnum.weekly:
      return `${i18n.t('dates.every')} ${momentDate.format(
        `dddd @ ${timeFormat}`,
      )}`;
    case ReminderTypeEnum.monthly:
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
  reminder: Reminder | null;
  style?: StyleProp<TextStyle>;
  placeholder?: string;
}) {
  return (
    <Text style={[styles.reminderText, style]}>
      {reminder && reminder.nextOccurrenceAt
        ? formatReminder(reminder)
        : placeholder || i18n.t('stepReminder:setReminder')}
    </Text>
  );
}
