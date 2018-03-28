import { Component } from 'react';
import { Image } from 'react-native';
import { Flex } from '../common';
import styles from './styles';

export default class LoadingGuy extends Component {
  render() {
    return (
      <Flex align="center" justify="center" style={styles.container}>
        <Image source={require('../../../assets/gifs/HappyBlueLoop.gif')} resizeMode="contain" style={styles.gif} />
      </Flex>
    );
  }
}