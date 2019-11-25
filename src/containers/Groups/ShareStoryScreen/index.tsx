import React, { useState } from 'react';
import { View, Keyboard } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useTranslation } from 'react-i18next';

import { Input } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
import BackButton from '../../BackButton';
import theme from '../../../theme';

import styles from './styles';

export const CREATE_A_STORY = gql`
  mutation CreateAStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      story {
        content
        createdAt
        id
        community {
          name
        }
        author {
          fullName
          id
        }
      }

      errors {
        message
        path
      }
    }
  }
`;

interface ShareStoryScreenProps {
  navigation: {
    state: {
      params: {
        onComplete: () => void;
        organization: {
          id: string;
        };
      };
    };
  };
}

const ShareStoryScreen = ({ navigation }: ShareStoryScreenProps) => {
  const { t } = useTranslation('shareAStoryScreen');
  const { container, backButton, textInput } = styles;
  const [story, changeStory] = useState('');
  const {
    state: {
      params: {
        onComplete,
        organization: { id },
      },
    },
  } = navigation;

  const [createStory] = useMutation(CREATE_A_STORY);
  const saveStory = async () => {
    if (!story) {
      return null;
    }
    Keyboard.dismiss();
    await createStory({
      variables: { input: { content: story, organizationId: id } },
    });
    onComplete();
  };
  return (
    <View style={container}>
      <Header left={<BackButton iconStyle={backButton} />} />
      <Input
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
      <BottomButton text={t('shareStory')} onPress={saveStory} />
    </View>
  );
};

export default ShareStoryScreen;
export const CELEBRATE_SHARE_STORY_SCREEN = 'nav/CELEBRATE_SHARE_STORY_SCREEN';
