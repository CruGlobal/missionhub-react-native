import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Markdown from 'react-native-simple-markdown';
import { ScrollView } from 'react-native';

import Header from '../../containers/Header/index';
import BackButton from '../../containers/BackButton/index';
import BottomButton from '../BottomButton/index';
import ReminderButton from '../ReminderButton/index';
import { Text } from '../common';

import styles, { markdownStyles } from './styles';

export default function StepDetailScreen({
  text,
  markdown,
  CenterHeader,
  RightHeader,
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
      <View style={bodyStyle}>
        {markdown && (
          <ScrollView>
            <Markdown styles={markdownStyles}>{markdown}</Markdown>
          </ScrollView>
        )}
      </View>
      {bottomButtonProps && <BottomButton {...bottomButtonProps} />}
    </View>
  );
}

StepDetailScreen.propTypes = {
  text: PropTypes.string.isRequired,
  markdown: PropTypes.string,
  CenterHeader: PropTypes.object,
  RightHeader: PropTypes.object,
  bottomButtonProps: PropTypes.object,
};
