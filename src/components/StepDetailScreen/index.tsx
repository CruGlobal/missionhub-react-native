import React from 'react';
import { StatusBar, View } from 'react-native';
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
  receiver?: {
    first_name: string;
  };
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
  receiver,
}: StepDetailScreenProps) => {
  const {
    stepTitleText,
    body,
    extraPadding,
    backButton,
    pageContainer,
  } = styles;

  const renderContent = () => (
    <>
      <Text style={stepTitleText}>{text}</Text>
      {CenterContent}
      <View style={[body, bottomButtonProps ? extraPadding : undefined]}>
        {markdown ? (
          <Markdown style={markdownStyles}>
            {markdown.replace(/<<name>>/g, receiver ? receiver.first_name : '')}
          </Markdown>
        ) : null}
      </View>
    </>
  );

  return (
    <View style={pageContainer}>
      <StatusBar {...theme.statusBar.darkContent} />
      <Header
        left={<BackButton iconStyle={backButton} />}
        center={CenterHeader}
        right={RightHeader}
      />
      {markdown ? (
        <ScrollView style={{ flex: 1 }}>{renderContent()}</ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{renderContent()}</View>
      )}
      {bottomButtonProps && <BottomButton {...bottomButtonProps} />}
    </View>
  );
};

export default StepDetailScreen;
