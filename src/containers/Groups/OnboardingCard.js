import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import HEARTS from '../../../assets/images/celebrateHearts.png';
// TODO: Include this once challenges are merged in
// import ARROW from '../../../assets/images/celebrateHearts.png';
import GLOBE from '../../../assets/images/globe.png';
import JOURNEY from '../../../assets/images/ourJourney.png';
import CONTACTS from '../../../assets/images/MemberContacts.png';
import SURVEY from '../../../assets/images/curiousIcon.png';
import { Flex, Text, Card, IconButton } from '../../components/common';
import { removeGroupOnboardingCard } from '../../actions/swipe';

import styles from './styles';

@translate('groupOnboardingCard')
class OnboardingCard extends Component {
  getImage() {
    switch (this.props.type) {
      case GROUP_ONBOARDING_TYPES.celebrate:
        return HEARTS;
      // case GROUP_ONBOARDING_TYPES.challenges:
      //   return ARROW;
      case GROUP_ONBOARDING_TYPES.impact:
        return GLOBE;
      case GROUP_ONBOARDING_TYPES.members:
        return JOURNEY;
      case GROUP_ONBOARDING_TYPES.contacts:
        return CONTACTS;
      case GROUP_ONBOARDING_TYPES.surveys:
        return SURVEY;
      default:
        return null;
    }
  }

  handlePress = () => {
    const { type, dispatch } = this.props;
    dispatch(removeGroupOnboardingCard(type));
  };

  render() {
    const { t, type, groupOnboarding } = this.props;
    if (!groupOnboarding[type]) {
      return null;
    }
    return (
      <Card style={styles.onboardingCard}>
        <Flex
          align="center"
          justify="center"
          style={styles.onboardingContainer}
        >
          <Image
            source={this.getImage()}
            style={styles.onboardingImage}
            resizeMode="contain"
          />
          <Text type="header" style={styles.onboardingHeader}>
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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
};

OnboardingCard.propTypes = {
  type: PropTypes.oneOf(Object.keys(GROUP_ONBOARDING_TYPES)).isRequired,
};

const mapStateToProps = ({ swipe }) => ({
  groupOnboarding: swipe.groupOnboarding || {},
});

export default connect(mapStateToProps)(OnboardingCard);
