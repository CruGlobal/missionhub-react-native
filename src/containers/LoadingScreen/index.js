import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';

import styles from './styles';
import { Flex } from '../../components/common';

class LoadingScreen extends Component {
  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <ActivityIndicator
          size="large"
          color="rgba(0, 0, 0, 1)"
        />
      </Flex>
    );
  }
}

export default LoadingScreen;
