import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Markdown from 'react-native-markdown-renderer';
import { ScrollView } from 'react-native';

import Header from '../Header/index';
import BackButton from '../../containers/BackButton/index';
import BottomButton from '../BottomButton/index';
import { Text } from '../common';
import markdownStyles from '../../markdownStyles';

import styles from './styles';

export default function StepDetailScreen({
  text,
  markdown,
  CenterHeader,
  RightHeader,
  CenterContent,
  bottomButtonProps,
}) {
  const { container, stepTitleText, backButton } = styles;

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
      {CenterContent}
      <View flex={1}>
        {markdown && (
          <ScrollView style={styles.body}>
            <Markdown style={markdownStyles}>{markdown}</Markdown>
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
