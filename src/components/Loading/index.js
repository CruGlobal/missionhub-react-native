import React, { Component } from 'react';
import { Image } from 'react-native';
import { Flex } from '../common';
import i18next from 'i18next';

import Text from '../Text';
import styles from './styles';

export default class Loading extends Component {
  render() {
    return (
      <Flex align="center" justify="center" style={styles.container}>
        <Flex value={2} />
        <Flex value={10}>
          <Image source={require('../../../assets/gifs/HappyBlueLoop.gif')} resizeMode="contain" style={styles.gif} />
        </Flex>
        <Flex value={2}>
          <Text type="header" style={styles.loadText}>{i18next.t('common:loading').toUpperCase()}</Text>
        </Flex>
        <Flex value={2} />
      </Flex>
    );
  }
}

