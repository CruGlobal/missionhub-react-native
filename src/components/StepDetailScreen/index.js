import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Markdown from 'react-native-markdown-renderer';
import { ScrollView } from 'react-native';

import Header from '../../containers/Header/index';
import BackButton from '../../containers/BackButton/index';
import BottomButton from '../BottomButton/index';
import ReminderButton from '../ReminderButton/index';
import { Text } from '../common';
import { markdownTheme } from '../../theme';

import styles from './styles';

export default function StepDetailScreen({
  text,
  markdown,
  CenterHeader,
  RightHeader,
  bottomButtonProps,
}) {
  const { container, stepTitleText, bodyStyle, backButton } = styles;

  const testMarkdown =
    '# HEADING 1\r\n## HEADING 2\r\n### HEADING 3\r\nSample text: **bold** and *italic*\r\n\r\n- Bullet 1\r\n- Bullet 2\r\n- Bullet 3\r\n1. Bullet 1\r\n2. Bullet 2\r\n3. Bullet 3\r\n\r\n---\r\n\r\n![Image](https://s3.amazonaws.com/stage.missionhub.com/organizations/community_photos/original/15853/1549383219755.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJKEW3SYT6MSDBAPA%2F20190227%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190227T160524Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=b1349c8dbc71bfa2af6bfcc953db10edeac258208ddb0b4fdf5905d0f7a25267)\r\n[Get MissionHub!](get.missionhub.com)\r\n\r\n> Some Quote \n> ~ Some Guy\r\n';

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
      <View flex={1}>
        {markdown && (
          <ScrollView style={styles.body}>
            <Markdown style={markdownTheme}>{testMarkdown}</Markdown>
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
