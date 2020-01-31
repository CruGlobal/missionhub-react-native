import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

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

import styles from './styles';

// @ts-ignore
@withTranslation('groupOnboardingCard')
class OnboardingCard extends Component {
  getImage() {
    // @ts-ignore
    switch (this.props.type) {
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
  }

  handlePress = () => {
    // @ts-ignore
    const { type, dispatch } = this.props;
    dispatch(removeGroupOnboardingCard(type));
  };

  render() {
    // @ts-ignore
    const { t, type, groupOnboarding } = this.props;
    if (!groupOnboarding[type]) {
      return null;
    }
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
            source={this.getImage()}
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
            onPress={this.handlePress}
            hitSlop={theme.hitSlop(10)}
          />
        </Flex>
      </Card>
    );
  }
}

export const GROUP_ONBOARDING_TYPES = {
  celebrate: 'celebrate',
  challenges: 'challenges',
  members: 'members',
  impact: 'impact',
  contacts: 'contacts',
  surveys: 'surveys',
  steps: 'steps',
};

// @ts-ignore
OnboardingCard.propTypes = {
  type: PropTypes.oneOf(Object.keys(GROUP_ONBOARDING_TYPES)).isRequired,
};

// @ts-ignore
const mapStateToProps = ({ swipe }) => ({
  groupOnboarding: swipe.groupOnboarding || {},
});

export default connect(mapStateToProps)(OnboardingCard);