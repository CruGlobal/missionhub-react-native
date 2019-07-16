import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, Image } from 'react-native';
import PropTypes from 'prop-types';

import { Flex, Text } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import AbsoluteSkip from '../../components/AbsoluteSkip';
import { BackButton } from '../BackButton';

import styles from './styles';

class IconMessageScreen extends Component {
  render() {
    const {
      onSkip,
      onBack,
      onComplete,
      mainText,
      buttonText,
      iconPath,
    } = this.props;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex align="start" justify="center" value={4}>
          <Image source={iconPath} style={styles.image} />
          <Text style={styles.text}>{mainText}</Text>
        </Flex>

        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
          <BottomButton onPress={onComplete} text={buttonText} />
        </SafeAreaView>
        {onSkip ? <AbsoluteSkip onSkip={onSkip} /> : null}
        {onBack ? <BackButton absolute={true} customNavigate={onBack} /> : null}
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
