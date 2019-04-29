import React, { Component } from 'react';
import { Linking, Image } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Button, Flex } from '../../components/common';
import { isAndroid } from '../../utils/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../constants';

import styles from './styles';

const { JOIN_COMMUNITY, JOIN_CHALLENGES } = NOTIFICATION_PROMPT_TYPES;

@translate('notificationOff')
class NotificationOffScreen extends Component {
  notNow = () => {
    this.close();
    this.props.dispatch(trackActionWithoutData(ACTIONS.NO_REMINDERS));
  };

  close() {
    const { onComplete } = this.props;

    //check if permissions have been set since entering this screen
    PushNotification.checkPermissions(permission => {
      onComplete(!!(permission && permission.alert));
    });
  }

  goToSettings = async () => {
    if (!isAndroid) {
      const APP_SETTINGS_URL = 'app-settings:';
      const isSupported = await Linking.canOpenURL(APP_SETTINGS_URL);

      if (isSupported) {
        await Linking.openURL(APP_SETTINGS_URL);
        return setTimeout(() => this.close(), 500);
      }
    }

    this.close();
  };

  descriptionText = () => {
    const { t, notificationType } = this.props;

    switch (notificationType) {
      case JOIN_COMMUNITY:
      case JOIN_CHALLENGES:
        return t(notificationType);
      default:
        return t('defaultDescription');
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
              source={require('../../../assets/images/notificationOff.png')}
            />
          </Flex>
          <Flex value={0.6} align="center" justify="center">
            <Text style={styles.title}>{t('title')}</Text>
            <Text style={styles.text}>{this.descriptionText()}</Text>
          </Flex>
          <Flex value={1} align="center" justify="center">
            <Button
              pill={true}
              type="primary"
              onPress={this.goToSettings}
              text={t('settings').toUpperCase()}
              style={styles.allowButton}
              buttonTextStyle={[styles.buttonText, styles.allowButtonText]}
            />
            <Button
              pill={true}
              onPress={this.notNow}
              text={t('noReminders').toUpperCase()}
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

NotificationOffScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  notificationType: PropTypes.string.isRequired,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(NotificationOffScreen);
export const NOTIFICATION_OFF_SCREEN = 'nav/NOTIFICATION_OFF';
