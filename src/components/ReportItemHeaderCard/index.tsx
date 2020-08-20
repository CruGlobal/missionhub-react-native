import React from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '../common';

import AlertIcon from './AlertIcon.svg';
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
      <AlertIcon />
      <Text style={styles.text}>
        {t('celebrateFeedHeader:reports', { count })}
      </Text>
    </Card>
  );
}
