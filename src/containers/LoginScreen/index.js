import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login, firstTime } from '../../actions/auth';
import styles from './styles';
import { Flex, Text, Button } from '../../components/common';

class LoginScreen extends Component {
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
          onPress={() => this.props.dispatch(login())}
          text="SIGN IN"
        />
        <Button
          onPress={() => this.props.dispatch(firstTime())}
          text="TRY IT NOW"
        />
      </Flex>
    );
  }
}

export default connect()(LoginScreen);
