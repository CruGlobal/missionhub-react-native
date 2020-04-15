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
import CloseIcon from '../../../assets/images/closeIcon.svg';
import { Flex, Text, Card } from '../../components/common';
import { removeGroupOnboardingCard } from '../../actions/swipe';
import { SwipeState } from '../../reducers/swipe';
import theme from '../../theme';

import styles from './styles';

interface OnboardingCardProps {
  type: GROUP_ONBOARDING_TYPES;
  permissions?: PermissionTypesEnum;
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

  const getText = () => {
    switch (type) {
      case GROUP_ONBOARDING_TYPES.challenges:
        return permissions === PermissionTypesEnum.admin
          ? t(`${GROUP_ONBOARDING_TYPES.challenges}AdminDescription`)
          : t(`${GROUP_ONBOARDING_TYPES.challenges}MemberDescription`);
      case GROUP_ONBOARDING_TYPES.celebrate:
      case GROUP_ONBOARDING_TYPES.impact:
      case GROUP_ONBOARDING_TYPES.members:
      case GROUP_ONBOARDING_TYPES.contacts:
      case GROUP_ONBOARDING_TYPES.surveys:
      case GROUP_ONBOARDING_TYPES.steps:
        return t(`${type}Description`);
    }
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
        <Text style={styles.onboardingDescription}>{getText()}</Text>
      </Flex>
      <Flex style={styles.onboardingIconWrap}>
        <CloseIcon
          testID="CloseIcon"
          onPress={handlePress}
          color={theme.lightGrey}
        />
      </Flex>
    </Card>
  );
};

export enum PermissionTypesEnum {
  admin = 'Admin',
  member = 'Member',
}

export enum GROUP_ONBOARDING_TYPES {
  celebrate = 'celebrate',
  challenges = 'challenges',
  members = 'members',
  impact = 'impact',
  contacts = 'contacts',
  surveys = 'surveys',
  steps = 'steps',
}

export default OnboardingCard;
