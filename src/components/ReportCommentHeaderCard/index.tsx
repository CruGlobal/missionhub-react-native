import React from 'react';
import { useTranslation } from 'react-i18next';

import { Text, Card, Icon } from '../../components/common';

import styles from './styles';

interface ReportCommentHeaderCardProps {
  testID?: string;
  count: number;
  onPress: () => void;
}

export default function ReportCommentHeaderCard({
  count,
  onPress,
}: ReportCommentHeaderCardProps) {
  const { t } = useTranslation();
  return (
    <Card
      testID="ReportCommentHeaderCardButton"
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
