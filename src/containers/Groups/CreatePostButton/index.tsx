import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';

import { Button, Text } from '../../../components/common';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { CELEBRATE_SHARE_STORY_SCREEN } from '../ShareStoryScreen';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';

import styles from './styles';

interface CreatePostButton {
  dispatch: ThunkDispatch<{}, null, never>;
  refreshItems: () => void;
  orgId: string;
}

export const CreatePostButton = ({
  dispatch,
  refreshItems,
  orgId,
}: CreatePostButton) => {
  const { t } = useTranslation('communityPost');
  const {
    container,
    inputButton,
    inputText,
    profileWrapper,
    profileText,
  } = styles;

  const onPress = () => {
    return dispatch(
      navigatePush(CELEBRATE_SHARE_STORY_SCREEN, {
        //TODO: link to new CreatePostScreen
        organization: { id: orgId },
        onComplete: () => {
          refreshItems();
          dispatch(navigateBack());
        },
      }),
    );
  };

  const renderProfile = () => (
    <View style={profileWrapper}>
      <Text style={profileText}>C</Text>
    </View>
  );

  return orgId !== GLOBAL_COMMUNITY_ID ? (
    <View style={container}>
      <Button style={inputButton} onPress={onPress} testID="ShareStoryInput">
        {renderProfile()}
        <Text style={inputText}>{t('buttonPlaceholder')}</Text>
      </Button>
    </View>
  ) : null;
};
