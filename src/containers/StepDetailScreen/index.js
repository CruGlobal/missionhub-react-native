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
    const { CenterHeader, RightHeader } = this.props;
    const { container, backButton } = styles;

    return (
      <Header
        left={<BackButton iconStyle={backButton} />}
        center={CenterHeader}
        right={RightHeader}
        shadow={false}
        style={container}
      />
    );
  }

  renderBody() {
    const { Body } = this.props;
    const { bodyStyle } = styles;

    if (!Body) {
      return <View style={bodyStyle} />;
    }

    return <View style={bodyStyle}>{Body}</View>;
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
        {this.renderBody()}
        {this.renderBottomButton()}
      </View>
    );
  }
}

StepDetailScreen.propTypes = {
  text: PropTypes.string.isRequired,
  CenterHeader: PropTypes.object,
  RightHeader: PropTypes.object,
  Body: PropTypes.object,
  bottomButtonProps: PropTypes.object,
};
