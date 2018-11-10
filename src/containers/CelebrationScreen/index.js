import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import { Flex } from '../../components/common';
import { isAndroid, disableBack } from '../../utils/common';

import styles from './styles';

class CelebrationScreen extends Component {
  timeoutId = null;

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  startTimer = () => {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(this.navigateToNext, isAndroid ? 2880 : 3350);
  };

  navigateToNext = () => {
    const { dispatch, next } = this.props;

    dispatch(next());
  };

  static shuffleGif() {
    const id = Math.floor(Math.random() * 6);
    return CelebrationScreen.getGif(id);
  }

  static getGif(id) {
    switch (id) {
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
      default:
        return undefined;
    }
  }

  onBackPress = () => true; // Return true to disable back button

  render() {
    const { gifId } = this.props;

    return (
      <Flex style={styles.container} value={1} justify="center">
        <Image
          source={
            CelebrationScreen.getGif(gifId) || CelebrationScreen.shuffleGif()
          }
          resizeMode="contain"
          style={styles.gif}
          onLoad={this.startTimer}
        />
        <AndroidBackHandler onBackPress={this.onBackPress} />
      </Flex>
    );
  }
}

CelebrationScreen.propTypes = {
  next: PropTypes.func.isRequired,
};

export default connect()(CelebrationScreen);
export const CELEBRATION_SCREEN = 'nav/CELEBRATION';
