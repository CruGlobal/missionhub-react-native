import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';

import styles from './styles';
import { Text, Button, Flex } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { disableAskPushNotification } from '../../actions/notifications';

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
    this.props.dispatch(navigatePush('MainTabs'));
  }

  render() {
    return (
      <Flex style={styles.container}>
        <Flex value={.2} />
        <Flex value={1} align="center" justify="center">
          <Flex align="center">
            <Image source={require('../../../assets/images/notificationPrimer.png')} />
            <Text style={styles.text}>
              MissionHub will send you reminders to help you take your steps.
            </Text>
          </Flex>
          <Flex value={.7} align="center" justify="center">
            <Button
              pill={true}
              type="primary"
              onPress={this.done}
              text="ALLOW NOTIFICATIONS"
              style={styles.allowButton}
              buttonTextStyle={styles.buttonText}
            />
            <Button
              pill={true}
              onPress={this.notNow}
              text="NOT NOW"
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
