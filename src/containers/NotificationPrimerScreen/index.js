import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import styles from './styles';
import { Text, Button, Flex } from '../../components/common';
import { setupPushNotifications, enableAskPushNotification, disableAskPushNotification } from '../../actions/notifications';

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
  }

  allow() {
    this.props.dispatch(enableAskPushNotification());
    this.props.dispatch(setupPushNotifications()).then(() => {
      this.props.onComplete();
    }).catch(() => {
      this.props.onComplete();
    });
  }

  render() {
    const { t } = this.props;
    return (
      <Flex style={styles.container}>
        <Flex value={.2} />
        <Flex value={1} align="center" justify="center">
          <Flex align="center">
            <Image source={require('../../../assets/images/notificationPrimer.png')} />
            <Text style={styles.text}>
              {t('description')}
            </Text>
          </Flex>
          <Flex value={.7} align="center" justify="center">
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
