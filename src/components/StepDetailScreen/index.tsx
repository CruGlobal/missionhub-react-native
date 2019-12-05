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
    firstName: string;
  };
  markdown?: string;
  CenterHeader?: React.ReactNode;
  RightHeader?: React.ReactNode;
  CenterContent?: React.ReactNode;
  Banner?: React.ReactNode;
  bottomButtonProps?: BottomButtonProps;
}

const StepDetailScreen = ({
  text,
  markdown,
  CenterHeader,
  RightHeader,
  CenterContent,
  bottomButtonProps,
  receiver = { firstName: '' },
  Banner = null,
}: StepDetailScreenProps) => {
  const { stepTitleText, backButton, pageContainer } = styles;

  return (
    <View style={pageContainer}>
      <StatusBar {...theme.statusBar.darkContent} />
      <Header
        left={<BackButton iconStyle={backButton} />}
        center={CenterHeader}
        right={RightHeader}
      />
      {Banner}
      <Text style={stepTitleText}>{text}</Text>
      {CenterContent}
      <View style={{ flex: 1 }}>
        {markdown ? (
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContainer}
          >
            <Markdown style={markdownStyles}>
              {markdown.replace(
                /<<name>>/g,
                receiver ? receiver.firstName : '',
              )}
            </Markdown>
          </ScrollView>
        ) : null}
      </View>
      {bottomButtonProps && <BottomButton {...bottomButtonProps} />}
    </View>
  );
};

export default StepDetailScreen;
