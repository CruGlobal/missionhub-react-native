import React from 'react';
import { View } from 'react-native';
import { Text, Input } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
import BackButton from '../../BackButton';

import { useTranslation } from 'react-i18next';
import styles from './styles';
import theme from '../../../theme';

const ShareStoryScreen = () => {
  const { t } = useTranslation('shareAStoryScreen');
  const { container, backButton } = styles;
  return (
    <View style={container}>
      <Header left={<BackButton iconStyle={backButton} />} />
      <BottomButton text={t('shareStory')} onPress={() => console.log('hi')} />
    </View>
  );
};

export default ShareStoryScreen;

export const CELEBRATE_SHARE_STORY_SCREEN = 'nav/CELEBRATE_SHARE_STORY_SCREEN';
