import React from 'react';
import { useTranslation } from 'react-i18next';

import { Text, Card, Icon } from '../common';

import styles from './styles';

interface ReportItemHeaderCardProps {
  testID?: string;
  count: number;
  onPress: () => void;
}

export default function ReportItemHeaderCard({
  count,
  onPress,
}: ReportItemHeaderCardProps) {
  const { t } = useTranslation();
  return (
    <Card
      testID="ReportItemHeaderCardButton"
      onPress={onPress}
      style={styles.card}
    >
      <Icon
        name="uncontactedIcon"
        type="MissionHub"
        size={20}
        style={styles.icon}
      />
      <Text style={styles.text}>
        {t('celebrateFeedHeader:reports', { count })}
      </Text>
    </Card>
  );
}
