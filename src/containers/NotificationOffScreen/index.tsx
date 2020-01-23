import React, { Component } from 'react';
import { Linking, Image, View } from 'react-native';
// @ts-ignore
import PushNotification from 'react-native-push-notification';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Button } from '../../components/common';
import { isAndroid } from '../../utils/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../../constants';

import styles from './styles';

const {
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
} = NOTIFICATION_PROMPT_TYPES;

// @ts-ignore
@withTranslation('notificationOff')
class NotificationOffScreen extends Component {
  notNow = () => {
    this.close();
    // @ts-ignore
    this.props.dispatch(trackActionWithoutData(ACTIONS.NO_REMINDERS));
  };

  close() {
    // @ts-ignore
    const { onComplete } = this.props;

    //check if permissions have been set since entering this screen
    // @ts-ignore
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
    // @ts-ignore
    const { t, notificationType } = this.props;

    switch (notificationType) {
      case JOIN_COMMUNITY:
        return t('joinCommunity');
      case JOIN_CHALLENGE:
        return t('joinChallenge');
      default:
        return t('defaultDescription');
    }
  };

  notNowButtonText = () => {
    // @ts-ignore
    const { t, notificationType } = this.props;

    switch (notificationType) {
      case SET_REMINDER:
        return t('noReminders');
      default:
        return t('notNow');
    }
  };

  render() {
    // @ts-ignore
    const { t } = this.props;
    const {
      container,
      imageWrap,
      title,
      text,
      buttonWrap,
      button,
      allowButton,
      notNowButton,
      buttonText,
    } = styles;

    return (
      <View
        // @ts-ignore
        value={1}
        alignItems="center"
        justifyContent="center"
        style={container}
      >
        <View style={imageWrap}>
          <Image
            source={require('../../../assets/images/notificationOff.png')}
          />
        </View>
        <Text style={title}>{t('title')}</Text>
        <Text style={text}>{this.descriptionText()}</Text>
        <View style={buttonWrap}>
          <Button
            pill={true}
            type="primary"
            onPress={this.goToSettings}
            text={t('settings').toUpperCase()}
            style={[button, allowButton]}
            buttonTextStyle={buttonText}
          />
          <Button
            pill={true}
            onPress={this.notNow}
            text={this.notNowButtonText().toUpperCase()}
            style={[button, notNowButton]}
            buttonTextStyle={buttonText}
          />
        </View>
      </View>
    );
  }
}

// @ts-ignore
NotificationOffScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  notificationType: PropTypes.string.isRequired,
};

// @ts-ignore
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(NotificationOffScreen);
export const NOTIFICATION_OFF_SCREEN = 'nav/NOTIFICATION_OFF';
