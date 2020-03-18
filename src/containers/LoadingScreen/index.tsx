import React from 'react';
import { ActivityIndicator } from 'react-native';

import { Flex } from '../../components/common';

import styles from './styles';

const LoadingScreen = () => {
  return (
    <Flex align="center" justify="center" value={1} style={styles.container}>
      <ActivityIndicator size="large" color="rgba(0, 0, 0, 1)" />
    </Flex>
  );
};

export default LoadingScreen;
export const LOADING_SCREEN = 'nav/LOADING_SCREEN';
