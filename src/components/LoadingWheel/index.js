import React, { Component } from 'react';
import { Image } from 'react-native';
import { Flex } from '../common';
import styles from './styles';

export default class LoadingWheel extends Component {
  render() {
    return (
      <Flex value={1} align="center" justify="center" >
        <Image source={require('../../../assets/gifs/loadingSpiralBlue.gif')} resizeMode="contain" style={styles.gif} />
      </Flex>
    );
  }
}