import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Button, Flex } from '../../components/common';
import { requestNativePermissions } from '../../actions/notifications';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../constants';

import styles from './styles';

const {
  FOCUS_STEP,
  LOGIN,
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
} = NOTIFICATION_PROMPT_TYPES;

@withTranslation('notificationPrimer')
class NotificationPrimerScreen extends Component {
  notNow = () => {
    const { dispatch, onComplete } = this.props;

    onComplete(false);
    dispatch(trackActionWithoutData(ACTIONS.NOT_NOW));
  };

  allow = async () => {
    const { dispatch, onComplete } = this.props;
    let acceptedNotifications = false;

    try {
      const response = await dispatch(requestNativePermissions());
      acceptedNotifications = response.acceptedNotifications;
    } finally {
      onComplete(acceptedNotifications);
    }
    dispatch(trackActionWithoutData(ACTIONS.ALLOW));
  };

  descriptionText = () => {
    const { t, notificationType } = this.props;

    switch (notificationType) {
      case FOCUS_STEP:
        return t('focusStep');
      case LOGIN:
        return t('login');
      case SET_REMINDER:
        return t('setReminder');
      case JOIN_COMMUNITY:
        return t('joinCommunity');
      case JOIN_CHALLENGE:
        return t('joinChallenge');
      default:
        return t('onboarding');
    }
  };

  render() {
    const { t } = this.props;
    return (
      <Flex style={styles.container}>
        <Flex value={0.3} />
        <Flex value={1} align="center" justify="center">
          <Flex value={1} align="center" justify="center">
            <Image
              source={require('../../../assets/images/notificationPrimer.png')}
            />
          </Flex>
          <Flex value={0.6} align="center" justify="center">
            <Text style={styles.text}>{this.descriptionText()}</Text>
          </Flex>
          <Flex value={1} align="center" justify="center">
            <Button
              pill={true}
              type="primary"
              onPress={this.allow}
              text={t('allow').toUpperCase()}
              style={styles.allowButton}
              buttonTextStyle={styles.buttonText}
            />
            <Button
              pill={true}
              onPress={this.notNow}
              text={t('notNow').toUpperCase()}
              style={styles.notNowButton}
              buttonTextStyle={styles.buttonText}
            />
          </Flex>
        </Flex>
        <Flex value={0.3} />
      </Flex>
    );
  }
}

NotificationPrimerScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  notificationType: PropTypes.string.isRequired,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(NotificationPrimerScreen);
export const NOTIFICATION_PRIMER_SCREEN = 'nav/NOTIFICATION_PRIMER';
