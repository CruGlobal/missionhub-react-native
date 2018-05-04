import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Button, Flex } from '../../components/common';
import { registerNotificationHandler, enableAskPushNotification, disableAskPushNotification } from '../../actions/notifications';
import { trackAction } from '../../actions/analytics';
import { ACTIONS } from '../../constants';

import styles from './styles';

@translate('notificationPrimer')
class NotificationPrimerScreen extends Component {

  constructor(props) {
    super(props);

    this.allow = this.allow.bind(this);
    this.notNow = this.notNow.bind(this);
  }

  notNow() {
    this.props.dispatch(disableAskPushNotification());
    this.props.onComplete();
    this.props.dispatch(trackAction(ACTIONS.NOT_NOW));
  }

  async allow() {
    this.props.dispatch(enableAskPushNotification());
    try {
      await this.props.dispatch(registerNotificationHandler());
    } finally {
      this.props.onComplete();
    }
    this.props.dispatch(trackAction(ACTIONS.ALLOW));
  }

  render() {
    const { t } = this.props;
    return (
      <Flex style={styles.container}>
        <Flex value={.3} />
        <Flex value={1} align="center" justify="center">
          <Flex value={1} align="center" justify="center">
            <Image source={require('../../../assets/images/notificationPrimer.png')} />
          </Flex>
          <Flex value={.6} align="center" justify="center">
            <Text style={styles.text}>
              {t('description')}
            </Text>
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
        <Flex value={.3} />
      </Flex>
    );
  }
}

NotificationPrimerScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(NotificationPrimerScreen);
export const NOTIFICATION_PRIMER_SCREEN = 'nav/NOTIFICATION_PRIMER';
