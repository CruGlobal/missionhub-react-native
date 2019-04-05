import React from 'react';
import i18n from 'i18next';

import { Text, Card, Icon } from '../../components/common';

import styles from './styles';

export default function ReportCommentHeaderCard({ count, onPress }) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <Icon
        name="uncontactedIcon"
        type="MissionHub"
        size={20}
        style={styles.icon}
      />
      <Text style={styles.text}>
        {i18n.t('celebrateFeedHeader:reports', { count })}
      </Text>
    </Card>
  );
}
