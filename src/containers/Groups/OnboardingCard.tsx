import React from 'react';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import HEARTS from '../../../assets/images/celebrateHearts.png';
import TARGET from '../../../assets/images/challengeTarget.png';
import GLOBE from '../../../assets/images/globe.png';
import JOURNEY from '../../../assets/images/ourJourney.png';
import CONTACTS from '../../../assets/images/MemberContacts.png';
import SURVEY from '../../../assets/images/curiousIcon.png';
import STEPS from '../../../assets/images/footprints.png';
import CLOSE_ICON from '../../../assets/images/closeIcon.png';
import { Flex, Text, Card, IconButton } from '../../components/common';
import { removeGroupOnboardingCard } from '../../actions/swipe';
import { SwipeState } from '../../reducers/swipe';
import theme from '../../theme';

import styles from './styles';

interface OnboardingCardProps {
  type: string;
  permissions?: string;
}

const OnboardingCard = ({ type, permissions }: OnboardingCardProps) => {
  const { t } = useTranslation('groupOnboardingCard');
  const groupOnboarding = useSelector(
    ({ swipe }: { swipe: SwipeState }) => swipe.groupOnboarding,
  );
  const dispatch = useDispatch();
  const getImage = () => {
    switch (type) {
      case GROUP_ONBOARDING_TYPES.celebrate:
        return HEARTS;
      case GROUP_ONBOARDING_TYPES.challenges:
        return TARGET;
      case GROUP_ONBOARDING_TYPES.impact:
        return GLOBE;
      case GROUP_ONBOARDING_TYPES.members:
        return JOURNEY;
      case GROUP_ONBOARDING_TYPES.contacts:
        return CONTACTS;
      case GROUP_ONBOARDING_TYPES.surveys:
        return SURVEY;
      case GROUP_ONBOARDING_TYPES.steps:
        return STEPS;
      default:
        return null;
    }
  };

  const handlePress = () => {
    dispatch(removeGroupOnboardingCard(type));
  };

  if (!groupOnboarding[type]) {
    return null;
  }

  return (
    <Card style={styles.onboardingCard}>
      <Flex
        value={1}
        align="center"
        justify="center"
        style={styles.onboardingContainer}
      >
        <Image
          source={getImage()}
          style={styles.onboardingImage}
          resizeMode="contain"
        />
        <Text style={styles.onboardingHeader}>{t(`${type}Header`)}</Text>
        <Text style={styles.onboardingDescription}>
          {t(`${type}${permissions ? permissions : ''}Description`)}
        </Text>
      </Flex>
      <Flex style={styles.onboardingIconWrap}>
        <IconButton
          style={styles.onboardingIcon}
          name="deleteIcon"
          type="MissionHub"
          image={CLOSE_ICON}
          onPress={handlePress}
          hitSlop={theme.hitSlop(10)}
        />
      </Flex>
    </Card>
  );
};

export const GROUP_ONBOARDING_TYPES = {
  celebrate: 'celebrate',
  challenges: 'challenges',
  members: 'members',
  impact: 'impact',
  contacts: 'contacts',
  surveys: 'surveys',
  steps: 'steps',
};

export default OnboardingCard;
