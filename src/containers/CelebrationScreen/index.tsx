import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { Flex } from '../../components/common';
import { navigateToMainTabs } from '../../actions/navigation';
import { isAndroid, disableBack } from '../../utils/common';
import Analytics from '../Analytics';

import styles from './styles';

class CelebrationScreen extends Component {
  // @ts-ignore
  constructor(props) {
    super(props);
    // @ts-ignore
    this.timeoutId = null;

    this.startTimer = this.startTimer.bind(this);
  }

  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    // @ts-ignore
    clearTimeout(this.timeoutId);
    disableBack.remove();
  }

  startTimer() {
    // @ts-ignore
    clearTimeout(this.timeoutId);
    // @ts-ignore
    this.timeoutId = setTimeout(
      () => this.navigateToNext(),
      isAndroid ? 2880 : 3350,
    );
  }

  navigateToNext() {
    const {
      // @ts-ignore
      dispatch,
      // @ts-ignore
      onComplete,
      // @ts-ignore
      next,
      // @ts-ignore
      personId,
      // @ts-ignore
      orgId,
    } = this.props;
    disableBack.remove();

    if (next) {
      dispatch(next({ personId, orgId }));
    } else if (onComplete) {
      onComplete();
    } else {
      dispatch(navigateToMainTabs());
    }
  }

  static shuffleGif() {
    const id = Math.floor(Math.random() * 5);
    return CelebrationScreen.getGif(id);
  }

  // @ts-ignore
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
    // @ts-ignore
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

// @ts-ignore
CelebrationScreen.propTypes = {
  onComplete: PropTypes.func,
  next: PropTypes.func,
};

// @ts-ignore
const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(CelebrationScreen);
export const CELEBRATION_SCREEN = 'nav/CELEBRATION';
