import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card, Input } from '../../../components/common';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { CELEBRATE_SHARE_STORY_SCREEN } from '../ShareStoryScreen';

import styles from './styles';

interface ShareStoryInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: any;
  refreshItems: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization: any;
}

const ShareStoryInput = ({
  dispatch,
  refreshItems,
  organization,
}: ShareStoryInputProps) => {
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
      <Card style={inputContainer} onPress={onPress} testID="ShareStoryInput">
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
