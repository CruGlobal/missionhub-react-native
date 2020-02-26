import React from 'react';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card, Text, Flex, Button } from '../../components/common';
import ChallengeStats, {
  ChallengeItem as ChallengeItemType,
} from '../ChallengeStats';
import CHALLENGE_COMPLETE from '../../../assets/images/challengeComplete.png';
import CHALLENGE_COMPLETE_GREEN from '../../../assets/images/challengeCompleteGreen.png';

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
            {completed ? (
              <Flex value={0}>
                <Image source={CHALLENGE_COMPLETE_GREEN} />
              </Flex>
            ) : null}
          </Flex>
        </Flex>
      </Button>
      {showButton ? (
        <Button
          image={joined ? CHALLENGE_COMPLETE : null}
          type="primary"
          testID="ChallengeItemActionButton"
          style={styles.joinCompleteButton}
          buttonTextStyle={styles.joinCompleteButtonText}
          text={t(joined ? 'iDidIt' : 'join').toUpperCase()}
          onPress={joined ? handleComplete : handleJoin}
        />
      ) : null}
    </Card>
  );
};

export default ChallengeItem;
