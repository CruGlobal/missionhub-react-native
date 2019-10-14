import React, { ReactNode } from 'react';
import { StatusBar, SafeAreaView, View } from 'react-native';
import Markdown from 'react-native-markdown-renderer';
import { ScrollView } from 'react-native';

import Header from '../Header/index';
import BackButton from '../../containers/BackButton/index';
import BottomButton, { BottomButtonProps } from '../BottomButton/index';
import { Text } from '../common';
import markdownStyles from '../../markdownStyles';
import theme from '../../theme';

import styles from './styles';

interface StepDetailScreenProps {
  text: string;
  markdown?: string;
  CenterHeader?: React.ReactNode;
  RightHeader?: React.ReactNode;
  CenterContent?: React.ReactNode;
  bottomButtonProps?: BottomButtonProps;
}

const StepDetailScreen = ({
  text,
  markdown,
  CenterHeader,
  RightHeader,
  CenterContent,
  bottomButtonProps,
}: StepDetailScreenProps) => {
  const { stepTitleText, backButton, flex1 } = styles;

  return (
    <SafeAreaView style={flex1}>
      <StatusBar {...theme.statusBar.darkContent} />
      <Header
        left={<BackButton iconStyle={backButton} />}
        center={CenterHeader}
        right={RightHeader}
      />
      <Text style={stepTitleText}>{text}</Text>
      {CenterContent}
      <View style={flex1}>
        {markdown ? (
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContainer}
          >
            <Markdown style={markdownStyles}>{markdown}</Markdown>
          </ScrollView>
        ) : null}
      </View>
      {bottomButtonProps && <BottomButton {...bottomButtonProps} />}
    </SafeAreaView>
  );
};

export default StepDetailScreen;
