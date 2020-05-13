import React from 'react';
import { StatusBar, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-native-markdown-renderer';
import { ScrollView } from 'react-native';

import Header from '../Header/index';
import BottomButton, { BottomButtonProps } from '../BottomButton/index';
import { Text, Flex, DateComponent } from '../common';
import Avatar from '../Avatar';
import markdownStyles from '../../markdownStyles';
import theme from '../../theme';
import { isAndroid } from '../../utils/common';
import { StepTypeEnum } from '../../../__generated__/globalTypes';
import { StepTypeBadge } from '../StepTypeBadge/StepTypeBadge';
import { insertName } from '../../utils/steps';
import BackButton from '../BackButton';
import { Post } from '../../containers/AcceptedStepDetailScreen/__generated__/Post';

import styles from './styles';

interface StepDetailScreenProps {
  text?: string;
  stepType?: StepTypeEnum | null;
  firstName?: string;
  markdown?: string;
  CenterHeader?: React.ReactNode;
  RightHeader?: React.ReactNode;
  hideBackButton?: boolean;
  CenterContent?: React.ReactNode;
  Banner?: React.ReactNode;
  bottomButtonProps?: BottomButtonProps;
  post?: Post | null;
}

const StepDetailScreen = ({
  text = '',
  markdown = '',
  firstName = '',
  stepType,
  CenterHeader,
  RightHeader,
  hideBackButton = false,
  CenterContent,
  bottomButtonProps,
  Banner = null,
  post,
}: StepDetailScreenProps) => {
  const {
    stepTypeBadge,
    stepTitleText,
    body,
    pageContainer,
    personNameStyle,
    dateTextStyle,
  } = styles;
  const { t } = useTranslation('stepDetail');

  const renderContent = () => (
    <>
      {Banner}
      <StepTypeBadge style={stepTypeBadge} stepType={stepType} />
      <Text style={stepTitleText}>{text}</Text>
      {CenterContent}
      <View style={body}>
        {markdown ? (
          <Markdown style={markdownStyles}>
            {insertName(markdown, firstName)}
          </Markdown>
        ) : null}
        {post ? (
          <>
            <Flex direction="row">
              <Avatar person={post.author} size={'medium'} />
              <Flex style={{ marginLeft: 10 }}>
                <Text style={personNameStyle}>{post.author.fullName}</Text>
                <Flex direction="row" justify="center" align="center">
                  <DateComponent
                    style={dateTextStyle}
                    date={post.createdAt}
                    format={'MMM D @ LT'}
                  />
                  <Text
                    // TODO Add openPost action
                    style={{
                      paddingLeft: 10,
                      color: theme.parakeetBlue,
                      fontSize: 12,
                    }}
                  >
                    {t('openPost')}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex style={{ paddingTop: 10 }}>
              <Text style={{ fontSize: 16, color: theme.grey }}>
                {post.content}
              </Text>
            </Flex>
          </>
        ) : null}
      </View>
    </>
  );

  return (
    <View style={pageContainer}>
      <StatusBar {...theme.statusBar.darkContent} />
      <Header
        left={hideBackButton ? null : <BackButton />}
        center={CenterHeader}
        right={RightHeader}
      />
      {markdown || post ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: isAndroid
              ? bottomButtonProps
                ? 90
                : 32
              : undefined,
          }}
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
