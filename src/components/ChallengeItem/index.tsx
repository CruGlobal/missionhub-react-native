import React from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card, Flex, Button, Touchable } from '../../components/common';
import ChallengeStats, {
  ChallengeItem as ChallengeItemType,
} from '../ChallengeStats';

import CheckIcon from './CheckIcon.svg';
import CompleteCheckIcon from './CompleteCheckIcon.svg';
import styles from './styles';

interface ChallengeItemProps {
  item: ChallengeItemType;
  onComplete: (item: ChallengeItemType) => void;
  onJoin: (item: ChallengeItemType) => void;
  onSelect: (item: ChallengeItemType) => void;
  acceptedChallenge?: ChallengeItemType;
}

const ChallengeItem = ({
  item,
  onComplete,
  onJoin,
  onSelect,
  acceptedChallenge,
}: ChallengeItemProps) => {
  const { t } = useTranslation('challengeFeeds');
  const handleJoin = () => {
    onJoin(item);
  };
  const handleComplete = () => {
    onComplete(item);
  };
  const handleSelect = () => {
    onSelect(item);
  };
  const { title, isPast } = item;
  const joined = !!acceptedChallenge;
  const completed = !!(acceptedChallenge && acceptedChallenge.completed_at);
  const showButton = !isPast && !completed;
  return (
    <Card style={styles.card}>
      <Button
        testID="ChallengeItemSelectButton"
        type="transparent"
        style={styles.detailButton}
        onPress={handleSelect}
      >
        <Flex value={1} style={styles.content} direction="row" align="center">
          <Flex value={5} direction="column">
            <Text style={styles.title}>{title}</Text>
            <ChallengeStats challenge={item} style={styles.statsSection} />
          </Flex>
          <Flex value={1} align="end" justify="center">
            {completed ? <CheckIcon /> : null}
          </Flex>
        </Flex>
      </Button>
      {showButton ? (
        <Touchable
          testID="ChallengeItemActionButton"
          onPress={joined ? handleComplete : handleJoin}
          style={styles.joinCompleteButton}
        >
          {joined ? <CompleteCheckIcon /> : null}
          <Text style={styles.joinCompleteButtonText}>
            {t(joined ? 'iDidIt' : 'join').toUpperCase()}
          </Text>
        </Touchable>
      ) : null}
    </Card>
  );
};

export default ChallengeItem;
