import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button, Text } from '../../../components/common';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { CELEBRATE_SHARE_STORY_SCREEN } from '../ShareStoryScreen';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';

import styles from './styles';

interface CreatePostButtonProps {
  refreshItems: () => void;
  orgId: string;
}

export const CreatePostButton = ({
  refreshItems,
  orgId,
}: CreatePostButtonProps) => {
  const { t } = useTranslation('shareAStoryScreen');
  const dispatch = useDispatch();
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
