import React from 'react';
import i18n from 'i18next';

import { Text } from '../common';

import styles from './styles';

export default ({ reminder, style, placeholder }) => {
  const { type, at } = reminder || {};

  return (
    <Text style={[styles.reminderText, style]}>
      {type && at
        ? `${at} ${type}`
        : placeholder || i18n.t('stepReminder:setReminder')}
    </Text>
  );
};
