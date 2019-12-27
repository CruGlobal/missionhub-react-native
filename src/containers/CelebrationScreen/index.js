import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { Flex } from '../../components/common';
import { navigateReset, navigateToMainTabs } from '../../actions/navigation';
import { isAndroid, disableBack } from '../../utils/common';
import Analytics from '../Analytics';

import styles from './styles';

class CelebrationScreen extends Component {
  constructor(props) {
    super(props);
    this.timeoutId = null;

    this.startTimer = this.startTimer.bind(this);
  }

  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
    disableBack.remove();
  }

  startTimer() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(
      () => this.navigateToNext(),
      isAndroid ? 2880 : 3350,
    );
  }

  navigateToNext() {
    const {
      dispatch,
      onComplete,
      next,
      nextScreen,
      personId,
      orgId,
    } = this.props;
    disableBack.remove();

    if (next) {
      dispatch(next({ personId, orgId }));
    } else if (onComplete) {
      onComplete();
    } else {
      dispatch(nextScreen ? navigateReset(nextScreen) : navigateToMainTabs());
    }
  }

  static shuffleGif() {
    const id = Math.floor(Math.random() * 5);
    return CelebrationScreen.getGif(id);
  }

  static getGif(id) {
    switch (id) {
      case 0:
        return require('./gifs/ArrowWhite.gif');
      case 1:
        return require('./gifs/DinoWhite.gif');
      case 2:
        return require('./gifs/FireworksWhite.gif');
      case 3:
        return require('./gifs/NarwhalWhite.gif');
      case 4:
        return require('./gifs/PartyWhite.gif');
      default:
        return undefined;
    }
  }

  render() {
    const { gifId } = this.props;

    return (
      <Flex style={styles.container} value={1} justify="center">
        <Analytics screenName="gif" />
        <Image
          testID="gif"
          source={
            CelebrationScreen.getGif(gifId) || CelebrationScreen.shuffleGif()
          }
          resizeMode="contain"
          style={styles.gif}
          onLoad={this.startTimer}
        />
      </Flex>
    );
  }
}

CelebrationScreen.propTypes = {
  onComplete: PropTypes.func,
  next: PropTypes.func,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(CelebrationScreen);
export const CELEBRATION_SCREEN = 'nav/CELEBRATION';
