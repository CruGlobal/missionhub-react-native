import React, { useState } from 'react';
import { View, Keyboard } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import { Input } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
import BackButton from '../../BackButton';
import theme from '../../../theme';
import { Organization } from '../../../reducers/organizations';

import styles from './styles';

export const CREATE_A_STORY = gql`
  mutation CreateAStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      story {
        content
        id
        community {
          name
        }
        author {
          fullName
          id
        }
      }
    }
  }
`;

const ShareStoryScreen = () => {
  const { t } = useTranslation('shareAStoryScreen');
  const { container, backButton, textInput } = styles;
  const [story, changeStory] = useState('');
  const onComplete: () => Promise<void> = useNavigationParam('onComplete');
  const organization: Organization = useNavigationParam('organization');
  const [createStory] = useMutation(CREATE_A_STORY);

  const saveStory = async () => {
    if (!story) {
      return null;
    }
    Keyboard.dismiss();
    await createStory({
      variables: { input: { content: story, organizationId: organization.id } },
    });
    onComplete();
  };
  return (
    <View style={container}>
      <Header left={<BackButton iconStyle={backButton} />} />
      <Input
        testID="StoryInput"
        onChangeText={e => changeStory(e)}
        placeholder={t('inputPlaceholder')}
        value={story}
        autoFocus={false}
        autoCorrect={true}
        multiline={true}
        returnKeyType="done"
        blurOnSubmit={true}
        selectionColor={theme.secondaryColor}
        placeholderTextColor={theme.lightGrey}
        style={textInput}
      />
      <BottomButton
        text={t('shareStory')}
        onPress={saveStory}
        testID="SaveStoryButton"
      />
    </View>
  );
};

export default ShareStoryScreen;
export const CELEBRATE_SHARE_STORY_SCREEN = 'nav/CELEBRATE_SHARE_STORY_SCREEN';
