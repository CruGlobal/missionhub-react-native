import React, { Component } from 'react';
import { Platform, Linking, Switch } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import styles from './styles';
import { Text, Button, Flex } from '../../components/common';
import { navigateBack } from '../../actions/navigation';
import { enableAskPushNotification } from '../../actions/notifications';
import theme from '../../theme';

@translate('notificationOff')
class NotificationOffScreen extends Component {

  constructor(props) {
    super(props);

    this.goToSettings = this.goToSettings.bind(this);
    this.notNow = this.notNow.bind(this);
  }

  notNow() {
    this.close();
  }
  
  close(shouldAsk) {
    this.props.onClose(shouldAsk);
    this.props.dispatch(navigateBack());
  }

  goToSettings() {
    if (Platform.OS === 'ios') {
      const APP_SETTINGS_URL = 'app-settings:';
      Linking.canOpenURL(APP_SETTINGS_URL).then((isSupported) => {
        if (isSupported) {
          return Linking.openURL(APP_SETTINGS_URL).then(() => {
            setTimeout(() => this.close(true), 500);
          });
        }
        this.close(true);
      });
    } else {
      // Android link to settings not needed
      this.props.dispatch(enableAskPushNotification()).then(() => {
        this.close(true);
      }).catch(() => {
        this.close(true);
      });
    }
  }

  render() {
    const { t } = this.props;
    return (
      <Flex style={styles.container} align="center" justify="center">
        <Flex direction="row" align="center" justify="center" style={styles.allowRow}>
          <Text style={styles.allowText}>
            {t('allow')}
          </Text>
          <Switch
            value={true}
            disabled={true}
            tintColor={theme.white}
          />
        </Flex>
        <Text type="header" style={styles.title}>
          {t('title')}
        </Text>
        <Text style={styles.text}>
          {t('description')}
        </Text>
        <Flex align="center" justify="center">
          <Button
            pill={true}
            type="primary"
            onPress={this.goToSettings}
            text={t('settings').toUpperCase()}
            style={styles.allowButton}
            buttonTextStyle={[ styles.buttonText, styles.allowButtonText ]}
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
    );
  }
}

NotificationOffScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(NotificationOffScreen);
export const NOTIFICATION_OFF_SCREEN = 'nav/NOTIFICATION_OFF';