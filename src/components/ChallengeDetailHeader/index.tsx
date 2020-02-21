import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { Flex, Text, DateComponent } from '../common';
import ChallengeStats from '../ChallengeStats';

import styles from './styles';

type ChallengeType = {
  isPast: boolean;
  title: string;
  end_date: string;
  details_markdown?: string;
};

interface ChallengeDetailHeaderProps {
  challenge: ChallengeType;
}

const ChallengeDetailHeader = ({ challenge }: ChallengeDetailHeaderProps) => {
  const { t } = useTranslation('challengeFeeds');
  const { title, end_date, details_markdown } = challenge;
  const todaysDate = moment().endOf('day');
  const isDateWithinWeek = todaysDate.isSame(
    moment(end_date).endOf('day'),
    'week',
  );

  return (
    <ScrollView>
      <Flex direction="row" style={styles.wrap}>
        <Flex value={5} direction="column" justify="start">
          <Flex style={styles.section}>
            <Text style={styles.title}>{title}</Text>
          </Flex>
          <ChallengeStats
            challenge={challenge}
            style={styles.section}
            isDetailScreen={true}
          />
          <Flex style={styles.section}>
            <Text style={styles.subHeader}>{t('endDate')}</Text>
            <DateComponent
              date={end_date}
              format={isDateWithinWeek ? 'dddd' : 'dddd, LL'}
              style={styles.dateText}
            />
          </Flex>
          <Flex style={styles.detailSection}>
            <Text style={styles.subHeader}>{t('details')}</Text>
            <Text style={styles.detailText}>
              {details_markdown ? details_markdown : t('detailsPlaceholder')}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </ScrollView>
  );
};

export default ChallengeDetailHeader;
