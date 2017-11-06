import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login, firstTime } from '../../actions/auth';
import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import {navigatePush} from '../../actions/navigation';

class LoginScreen extends Component {
  login() {
    this.props.dispatch(login());
    this.navigateToWelcome();
  }

  tryItNow() {
    this.props.dispatch(firstTime());
    this.navigateToWelcome();
  }

  navigateToWelcome() {
    this.props.dispatch(navigatePush('Welcome'));
  }

  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Text>MissionHub</Text>
        <Text>Grow closer to God.</Text>
        <Text>Help others experience Him.</Text>
        <Button
          onPress={() => console.log('join')}
          text="JOIN"
        />
        <Button
          onPress={() => this.login()}
          text="SIGN IN"
        />
        <Button
          onPress={() => this.tryItNow()}
          text="TRY IT NOW"
        />
      </Flex>
    );
  }
}

export default connect()(LoginScreen);
