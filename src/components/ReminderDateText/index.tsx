import React from 'react';
import i18n from 'i18next';
import { StyleProp, TextStyle } from 'react-native';

import { Text } from '../common';
import { reminderFormat } from '../../utils/date';

import { ReminderDateText as Reminder } from './__generated__/ReminderDateText';
import styles from './styles';

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
        ? reminderFormat(reminder)
        : placeholder || i18n.t('stepReminder:setReminder')}
    </Text>
  );
}
