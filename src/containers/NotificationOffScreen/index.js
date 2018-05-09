import React, { Component } from 'react';
import { Linking, Image } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Button, Flex } from '../../components/common';
import { navigateBack } from '../../actions/navigation';
import { isAndroid } from '../../utils/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';

import styles from './styles';

@translate('notificationOff')
class NotificationOffScreen extends Component {

  constructor(props) {
    super(props);

    this.goToSettings = this.goToSettings.bind(this);
    this.notNow = this.notNow.bind(this);
  }

  notNow() {
    this.close();
    this.props.dispatch(trackActionWithoutData(ACTIONS.NO_REMINDERS));
  }

  close(shouldAsk) {
    const { onClose, dispatch } = this.props;

    onClose(shouldAsk);
    dispatch(navigateBack());
  }

  goToSettings() {
    if (!isAndroid) {
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
      this.close(true);
    }
  }

  render() {
    const { t } = this.props;
    return (
      <Flex style={styles.container}>
        <Flex value={.3} />
        <Flex value={1} align="center" justify="center">
          <Flex value={1} align="center" justify="center">
            <Image source={require('../../../assets/images/notificationOff.png')} />
          </Flex>
          <Flex value={.6} align="center" justify="center">
            <Text style={styles.title}>
              {t('title')}
            </Text>
            <Text style={styles.text}>
              {t('description')}
            </Text>
          </Flex>
          <Flex value={1} align="center" justify="center">
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
        <Flex value={.3} />
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
