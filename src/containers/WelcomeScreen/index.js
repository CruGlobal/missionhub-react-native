import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';

class WelcomeScreen extends Component {
  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Text>Growing close to God involves helping others experience Him. MissionHub joins you in that journey by suggesting steps of faith to take with others.</Text>
        <Button
          onPress={() => this.props.dispatch(navigatePush('Setup'))}
          text="OK"
        />
      </Flex>
    );
  }
}

export default connect()(WelcomeScreen);
