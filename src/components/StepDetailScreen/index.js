import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import Header from '../../containers/Header/index';
import BackButton from '../../containers/BackButton/index';
import BottomButton from '../BottomButton/index';
import ReminderButton from '../ReminderButton/index';
import { Text } from '../common';

import styles from './styles';

export default function StepDetailScreen({
  text,
  CenterHeader,
  RightHeader,
  Body,
  bottomButtonProps,
}) {
  const { container, stepTitleText, bodyStyle, backButton } = styles;

  return (
    <View flex={1} style={container}>
      <Header
        left={<BackButton iconStyle={backButton} />}
        center={CenterHeader}
        right={RightHeader}
        shadow={false}
        style={container}
      />
      <Text style={stepTitleText}>{text}</Text>
      <ReminderButton />
      <View style={bodyStyle}>{Body}</View>
      {bottomButtonProps && <BottomButton {...bottomButtonProps} />}
    </View>
  );
}

StepDetailScreen.propTypes = {
  text: PropTypes.string.isRequired,
  CenterHeader: PropTypes.object,
  RightHeader: PropTypes.object,
  Body: PropTypes.object,
  bottomButtonProps: PropTypes.object,
};
