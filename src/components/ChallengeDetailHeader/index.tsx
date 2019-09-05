import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Button, Text, DateComponent } from '../common';
import ChallengeStats from '../ChallengeStats';

import styles from './styles';

type ChallengeType = {
  isPast: boolean;
  title: string;
  end_date: string;
};

interface ChallengeDetailHeaderProps {
  challenge: ChallengeType;
  canEditChallenges?: boolean;
  onEdit?: (arg1: ChallengeType) => void;
}

const ChallengeDetailHeader = ({
  challenge,
  canEditChallenges,
  onEdit,
}: ChallengeDetailHeaderProps) => {
  const { t } = useTranslation('challengeFeeds');

  const handleEdit = () => {
    onEdit && onEdit(challenge);
  };
  const { isPast, title, end_date } = challenge;
  const canEdit = canEditChallenges && onEdit && !isPast;

  return (
    <Flex direction="row" style={styles.wrap}>
      <Flex value={5} direction="column" justify="start">
        <Flex style={styles.section}>
          {canEdit ? (
            <Flex direction="row">
              <Button
                testID="ChallengeDetailHeaderEditButton"
                type="transparent"
                text={t('Edit')}
                onPress={handleEdit}
                buttonTextStyle={styles.editButtonText}
              />
            </Flex>
          ) : null}
          <Text style={styles.title}>{title}</Text>
        </Flex>
        <Flex style={styles.section}>
          <Text style={styles.subHeader}>{t('endDate')}</Text>
          <DateComponent
            date={end_date}
            format={'dddd, LL'}
            style={styles.dateText}
          />
        </Flex>
        <ChallengeStats challenge={challenge} style={styles.section} />
      </Flex>
      <Flex value={1} />
    </Flex>
  );
};

export default ChallengeDetailHeader;
