import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login } from '../../actions/auth';
import styles from './styles';
import { Flex, Text, Button } from '../../components/common';

class LoginScreen extends Component {
  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Text>Login</Text>
        <Button
          onPress={() => this.props.dispatch(login())}
          text="Go To Main"
        />
      </Flex>
    );
  }
}

export default connect()(LoginScreen);
