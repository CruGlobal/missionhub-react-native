import React from 'react';
import { Card, Input } from '../../../components/common';
import { View } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { CELEBRATE_SHARE_STORY_SCREEN } from '../ShareStoryScreen';

interface ShareStoryInputProps {
  dispatch: any;
  refreshItems: () => void;
  organization: any;
}

const ShareStoryInput = ({ dispatch, refreshItems, organization }: any) => {
  const { t } = useTranslation('shareAStoryScreen');
  const { container, inputContainer, input } = styles;

  const onPress = () => {
    return dispatch(
      navigatePush(CELEBRATE_SHARE_STORY_SCREEN, {
        organization,
        onComplete: async () => {
          await refreshItems();
          dispatch(navigateBack());
        },
      }),
    );
  };

  return (
    <View style={container}>
      <Card style={inputContainer} onPress={onPress}>
        <Input
          onTouchStart={onPress}
          editable={false}
          style={input}
          placeholder={t('inputPlaceholder')}
        ></Input>
      </Card>
    </View>
  );
};

export default ShareStoryInput;
