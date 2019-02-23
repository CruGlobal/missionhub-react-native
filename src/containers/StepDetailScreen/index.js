import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import Header from '../Header';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';
import ReminderButton from '../../components/ReminderButton';
import { Text } from '../../components/common';

import styles from './styles';

export default class StepDetailScreen extends Component {
  renderHeader() {
    const { centerHeader, rightHeader } = this.props;
    const { container, backButton } = styles;

    return (
      <Header
        left={<BackButton iconStyle={backButton} />}
        center={centerHeader}
        right={rightHeader}
        shadow={false}
        style={container}
      />
    );
  }

  renderTipSection() {
    const { body } = this.props;

    if (!body) {
      return (
        <View
          style={{
            flex: 1,
            marginVertical: 26,
            paddingHorizontal: 32,
            paddingBottom: 14,
          }}
        />
      );
    }

    return body;
  }

  renderBottomButton = () => {
    const { bottomButtonProps } = this.props;

    if (!bottomButtonProps) {
      return null;
    }

    return bottomButtonProps && <BottomButton {...bottomButtonProps} />;
  };

  render() {
    const { text } = this.props;
    const { container, stepTitleText } = styles;

    return (
      <View flex={1} style={container}>
        {this.renderHeader()}
        <Text style={stepTitleText}>{text}</Text>
        <ReminderButton />
        {this.renderTipSection()}
        {this.renderBottomButton()}
      </View>
    );
  }
}

StepDetailScreen.propTypes = {
  text: PropTypes.string.isRequired,
  centerHeader: PropTypes.object,
  rightHeader: PropTypes.object,
  body: PropTypes.object,
  bottomButtonProps: PropTypes.object,
};
