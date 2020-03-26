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
import { StepTypeEnum } from '../../../__generated__/globalTypes';
import { StepTypeBadge } from '../StepTypeBadge/StepTypeBadge';
import { insertName } from '../../utils/steps';

import styles from './styles';

interface StepDetailScreenProps {
  text?: string;
  stepType?: StepTypeEnum | null;
  firstName?: string;
  markdown?: string;
  CenterHeader?: React.ReactNode;
  RightHeader?: React.ReactNode;
  CenterContent?: React.ReactNode;
  Banner?: React.ReactNode;
  bottomButtonProps?: BottomButtonProps;
}

const StepDetailScreen = ({
  text = '',
  markdown = '',
  firstName = '',
  stepType,
  CenterHeader,
  RightHeader,
  CenterContent,
  bottomButtonProps,
  Banner = null,
}: StepDetailScreenProps) => {
  const {
    stepTypeBadge,
    stepTitleText,
    body,
    backButton,
    pageContainer,
  } = styles;

  const renderContent = () => (
    <>
      {Banner}
      <StepTypeBadge style={stepTypeBadge} stepType={stepType} />
      <Text style={stepTitleText}>{insertName(text, firstName)}</Text>
      {CenterContent}
      <View style={body}>
        {markdown ? (
          <Markdown style={markdownStyles}>
            {insertName(markdown, firstName)}
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
        <ScrollView
          style={{ flex: 1 }}
          contentInset={{ bottom: bottomButtonProps ? 90 : 32 }}
        >
          {renderContent()}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{renderContent()}</View>
      )}
      {bottomButtonProps && <BottomButton {...bottomButtonProps} />}
    </View>
  );
};

export default StepDetailScreen;
