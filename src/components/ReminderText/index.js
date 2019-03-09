import React from 'react';
import i18n from 'i18next';

import { Text } from '../common';

import styles from './styles';

export default function ReminderText({ reminder, style }) {
  let text;
  if (reminder) {
    text = 'Wednesday @ 10 PM';
  } else {
    text = i18n.t('contactSteps:setReminder');
  }
  return <Text style={[styles.text, style]}>{text}</Text>;
}
