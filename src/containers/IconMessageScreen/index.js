import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { Flex, Text } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import AbsoluteSkip from '../../components/AbsoluteSkip';

import styles from './styles';

class IconMessageScreen extends Component {
  render() {
    const { onSkip, onComplete, mainText, buttonText, iconPath } = this.props;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex align="start" justify="center" value={4}>
          <Image source={iconPath} style={styles.image} />
          <Text style={styles.text}>{mainText}</Text>
        </Flex>
        <BottomButton onPress={onComplete} text={buttonText} />
        {onSkip ? <AbsoluteSkip onSkip={onSkip} /> : null}
      </Flex>
    );
  }
}

IconMessageScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  mainText: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  iconPath: PropTypes.any,
  onSkip: PropTypes.func,
};

export default connect()(IconMessageScreen);
