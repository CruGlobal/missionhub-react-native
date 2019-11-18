import React from 'react';
import { Card, Input } from '../../../components/common';
import { View } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { navigatePush } from '../../../actions/navigation';
import { CELEBRATE_SHARE_STORY_SCREEN } from '../ShareStoryScreen';

const ShareStoryInput = ({ dispatch }: any) => {
  const { t } = useTranslation('shareAStoryScreen');
  const { container, inputContainer, input } = styles;

  const onPress = () => {
    console.log('cool');
    return dispatch(navigatePush(CELEBRATE_SHARE_STORY_SCREEN));
  };

  return (
    <View style={container}>
      <Card style={inputContainer} onPress={onPress}>
        <Input
          editable={false}
          style={input}
          placeholder={t('inputPlaceholder')}
        ></Input>
      </Card>
    </View>
  );
};

export default ShareStoryInput;
