import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { Text, Flex } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { CHALLENGE_MEMBERS_SCREEN } from '../../containers/ChallengeMembers';
import { Organization } from '../../reducers/organizations';
import { Person } from '../../reducers/people';

import styles from './styles';

export type ChallengeItem = {
  id: string;
  title: string;
  isPast?: boolean;
  completed_at?: string;
  accepted_at?: string;
  creator_id?: string;
  organization_id?: string;
  end_date: string | Date;
  accepted_count: number;
  completed_count: number;
  created_at?: string;
  organization?: Organization;
  details_markdown?: string;
  person?: Person;
  accepted_community_challenges?: {
    completed_at?: string;
    id: string;
    person: {
      id: string;
    };
  }[];
};

interface ChallengeStatsProps {
  challenge: ChallengeItem;
  isDetailScreen?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ChallengeStats = ({
  challenge,
  isDetailScreen,
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
  const dispatch = useDispatch();
  // Total days or days remaining
  const endDate = moment(end_date).endOf('day');
  const startDate = moment(created_at).endOf('day');
  const today = moment().endOf('day');
  // If it's past, make sure it shows "1 day challenge instead of 0 day challenge"
  const days = isPast
    ? endDate.diff(startDate, 'days') + 1
    : endDate.diff(today, 'days');
  const numberStyle = !isDetailScreen ? styles.numberSmall : styles.number;
  const navToMemberScreen = (completed: boolean) => {
    if (
      (accepted_count > 0 && !completed) ||
      (completed_count > 0 && completed)
    ) {
      return dispatch(
        navigatePush(CHALLENGE_MEMBERS_SCREEN, {
          challenge,
          orgId: challenge.organization.id,
          completed,
        }),
      );
    }
  };

  return (
    <Flex style={containerStyle} direction="row" justify="between">
      {!isDetailScreen ? (
        <Flex value={1} direction="column" justify="start">
          <Text style={styles.subHeader}>
            {isPast ? t('days') : t('daysLeft')}
          </Text>
          <Text style={numberStyle}>{days}</Text>
        </Flex>
      ) : null}

      <Flex value={1} direction="column" justify="start">
        <Text style={styles.subHeader}>{t('joined')}</Text>
        <Text
          testID="joinedCount"
          onPress={() => navToMemberScreen(false)}
          style={numberStyle}
        >
          {accepted_count}
        </Text>
      </Flex>
      <Flex value={1} direction="column" justify="start">
        <Text style={styles.subHeader}>{t('completed')}</Text>
        <Text
          testID="completedCount"
          onPress={() => navToMemberScreen(true)}
          style={numberStyle}
        >
          {completed_count}
        </Text>
      </Flex>
      {isDetailScreen ? (
        <Flex value={1} direction="column" justify="start" />
      ) : null}
    </Flex>
  );
};

export default ChallengeStats;
