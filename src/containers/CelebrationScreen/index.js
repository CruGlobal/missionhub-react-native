import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Platform } from 'react-native';

import styles from './styles';
import { Flex } from '../../components/common';
import { navigatePush, navigateReset } from '../../actions/navigation';

class CelebrationScreen extends Component {
  timeoutId;

  startTimer() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.navigateToNext(), Platform.OS === 'android' ? 2880 : 3500);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  navigateToNext() {
    this.props.resetNav ?
      this.props.dispatch(navigateReset(this.props.nextScreen || 'MainTabs')) :
      this.props.dispatch(navigatePush(this.props.nextScreen || 'MainTabs'));
  }

  static shuffleGif() {
    switch (Math.floor(Math.random() * 6)) {
      case 0:
        return require('./gifs/ArrowWhite.gif');
      case 1:
        return require('./gifs/ClinkWhite.gif');
      case 2:
        return require('./gifs/DinoWhite.gif');
      case 3:
        return require('./gifs/FireworksWhite.gif');
      case 4:
        return require('./gifs/NarwhalWhite.gif');
      case 5:
        return require('./gifs/PartyWhite.gif');
    }
  }

  render() {
    return (
      <Flex style={styles.container} flex={1} justify="center">
        <Image source={CelebrationScreen.shuffleGif()} resizeMode="contain" style={styles.gif} onLoad={this.startTimer()} />
      </Flex>
    );
  }
}

export default connect()(CelebrationScreen);
