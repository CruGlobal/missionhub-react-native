import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-native-markdown-renderer';
import moment from 'moment';

import { Flex, Text, DateComponent } from '../common';
import ChallengeStats, { ChallengeItem } from '../ChallengeStats';
import markdownStyles from '../../markdownStyles';

import styles from './styles';

interface ChallengeDetailHeaderProps {
  challenge: ChallengeItem;
  isAdmin: boolean;
}

const ChallengeDetailHeader = ({
  challenge,
  isAdmin,
}: ChallengeDetailHeaderProps) => {
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
            <Markdown style={markdownStyles}>
              {details_markdown
                ? details_markdown
                : isAdmin
                ? t('detailsPlaceholder')
                : null}
            </Markdown>
          </Flex>
        </Flex>
      </Flex>
    </ScrollView>
  );
};

export default ChallengeDetailHeader;
