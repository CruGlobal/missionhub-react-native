import React, { useState } from 'react';
import { View, Keyboard } from 'react-native';
import { Input } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
import BackButton from '../../BackButton';

import { useTranslation } from 'react-i18next';
import styles from './styles';
import theme from '../../../theme';
import { useMutation } from '@apollo/react-hooks';

const ShareStoryScreen = () => {
  const { t } = useTranslation('shareAStoryScreen');
  const { container, backButton, textInput } = styles;
  const [story, changeStory] = useState('');

  const saveStory = () => {
    Keyboard.dismiss();
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
