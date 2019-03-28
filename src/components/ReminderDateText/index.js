import React from 'react';

import { Text } from '../common';

import styles from './styles';

export default ({ reminder, style, placeholder }) => {
  const { type, at } = reminder || {};

  return (
    <Text style={[styles.reminderText, style]}>
      {type && at ? `${at} ${type}` : placeholder}
    </Text>
  );
};
