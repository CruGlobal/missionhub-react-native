import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';
import { Text, Button, Flex } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { disableAskPushNotification } from '../../actions/notifications';
import { CELEBRATION_SCREEN } from '../CelebrationScreen';

@translate('notificationPrimer')
class NotificationPrimerScreen extends Component {

  constructor(props) {
    super(props);

    this.done = this.done.bind(this);
    this.notNow = this.notNow.bind(this);
  }

  notNow() {
    this.props.dispatch(disableAskPushNotification());
    this.done();
  }

  done() {
    this.props.dispatch(navigatePush(CELEBRATION_SCREEN));
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
              onPress={this.done}
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

export default connect()(NotificationPrimerScreen);
export const NOTIFICATION_PRIMER_SCREEN = 'nav/NOTIFICATION_PRIMER';
