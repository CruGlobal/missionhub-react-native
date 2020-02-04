import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';

import { Button, Text } from '../../../components/common';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { CELEBRATE_SHARE_STORY_SCREEN } from '../ShareStoryScreen';
import { Organization } from '../../../reducers/organizations';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';

import styles from './styles';

interface ShareStoryInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  refreshItems: () => void;
  organization: Organization;
}

const ShareStoryInput = ({
  dispatch,
  refreshItems,
  organization,
}: ShareStoryInputProps) => {
  const { t } = useTranslation('shareAStoryScreen');
  const { container, inputButton, inputText } = styles;
  const { id } = organization;

  const onPress = () => {
    return dispatch(
      navigatePush(CELEBRATE_SHARE_STORY_SCREEN, {
        organization,
        onComplete: () => {
          refreshItems();
          dispatch(navigateBack());
        },
      }),
    );
  };

  return id !== GLOBAL_COMMUNITY_ID ? (
    <View style={container}>
      <Button style={inputButton} onPress={onPress} testID="ShareStoryInput">
        <Text style={inputText}>{t('inputPlaceholder')}</Text>
      </Button>
    </View>
  ) : null;
};

export default ShareStoryInput;
