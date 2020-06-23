import React from 'react';

import { Flex, Text } from '../common';

import styles from './styles';

interface ReportItemLabelProps {
  label: string;
  user: string;
  communityName: string;
}

export default function ReportItemLabel({
  label,
  user,
  communityName,
}: ReportItemLabelProps) {
  return (
    <Flex value={1}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.user} numberOfLines={1}>
        {user}
      </Text>
      <Text style={styles.user} numberOfLines={1}>
        {communityName}
      </Text>
    </Flex>
  );
}
