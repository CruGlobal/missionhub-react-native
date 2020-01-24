import React from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import HEARTS from '../../../assets/images/celebrateHearts.png';
import TARGET from '../../../assets/images/challengeTarget.png';
import GLOBE from '../../../assets/images/globe.png';
import JOURNEY from '../../../assets/images/ourJourney.png';
import CONTACTS from '../../../assets/images/MemberContacts.png';
import SURVEY from '../../../assets/images/curiousIcon.png';
import STEPS from '../../../assets/images/footprints.png';
import { Flex, Text, Card, IconButton } from '../../components/common';
import { removeGroupOnboardingCard } from '../../actions/swipe';
import theme from '../../theme';
import { SwipeState } from '../../reducers/swipe';

import styles from './styles';

export enum GROUP_ONBOARDING_TYPES {
  celebrate,
  challenges,
  members,
  impact,
  contacts,
  surveys,
  steps,
}

export interface OnboardingCardProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  type: GROUP_ONBOARDING_TYPES;
  groupOnboarding: { [key: string]: boolean };
}

const OnboardingCard = ({
  dispatch,
  type,
  groupOnboarding,
}: OnboardingCardProps) => {
  const { t } = useTranslation('groupOnboardingCard');

  if (!groupOnboarding[type]) {
    return null;
  }

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

  const handlePress = () => dispatch(removeGroupOnboardingCard(type));

  return (
    <Card
      style={
        type === GROUP_ONBOARDING_TYPES.celebrate
          ? styles.onboardCardNoShadow
          : styles.onboardingCard
      }
    >
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
        <Text header={true} style={styles.onboardingHeader}>
          {t(`${type}Header`)}
        </Text>
        <Text style={styles.onboardingDescription}>
          {t(`${type}Description`)}
        </Text>
      </Flex>
      <Flex style={styles.onboardingIconWrap}>
        <IconButton
          style={styles.onboardingIcon}
          name="deleteIcon"
          type="MissionHub"
          onPress={handlePress}
          hitSlop={theme.hitSlop(10)}
        />
      </Flex>
    </Card>
  );
};

const mapStateToProps = ({ swipe }: { swipe: SwipeState }) => ({
  groupOnboarding: swipe.groupOnboarding || {},
});

export default connect(mapStateToProps)(OnboardingCard);
