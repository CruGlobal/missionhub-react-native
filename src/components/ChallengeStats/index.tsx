import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import moment from 'moment';

import { Text, Flex } from '../../components/common';

import styles from './styles';

type ChallengeItem = {
  title: string;
  isPast?: boolean;
  completed_at?: string;
  creator_id?: string;
  organization_id?: string;
  end_date?: string;
  accepted_count?: number;
  completed_count?: number;
  created_at?: string;
};

interface ChallengeStatsProps {
  challenge: ChallengeItem;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ChallengeStats = ({
  challenge,
  small,
  style: containerStyle,
}: ChallengeStatsProps) => {
  const { t } = useTranslation('challengeStats');

  const {
    end_date,
    accepted_count,
    completed_count,
    isPast,
    created_at,
  } = challenge;

  // Total days or days remaining
  const endDate = moment(end_date).endOf('day');
  const startDate = moment(created_at).endOf('day');
  const today = moment().endOf('day');
  // If it's past, make sure it shows "1 day challenge instead of 0 day challenge"
  const days = isPast
    ? endDate.diff(startDate, 'days') + 1
    : endDate.diff(today, 'days');
  const numberStyle = small ? styles.numberSmall : styles.number;

  return (
    <Flex style={containerStyle} direction="row" justify="between">
      {small ? (
        <Flex value={1} direction="column" justify="start">
          <Text style={styles.subHeader}>
            {isPast ? t('days') : t('daysLeft')}
          </Text>
          <Text style={numberStyle}>{days}</Text>
        </Flex>
      ) : null}

      <Flex value={1} direction="column" justify="start">
        <Text style={styles.subHeader}>{t('joined')}</Text>
        <Text style={numberStyle}>{accepted_count}</Text>
      </Flex>
      <Flex value={1} direction="column" justify="start">
        <Text style={styles.subHeader}>{t('completed')}</Text>
        <Text style={numberStyle}>{completed_count}</Text>
      </Flex>
      {!small ? <Flex value={1} direction="column" justify="start" /> : null}
    </Flex>
  );
};

export default ChallengeStats;
