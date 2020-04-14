import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Button, Text } from '../../../components/common';
import { navigatePush } from '../../../actions/navigation';
import { CREATE_POST_SCREEN } from '../CreatePostScreen';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { PostTypeEnum } from '../../../../__generated__/globalTypes';

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
      navigatePush(CREATE_POST_SCREEN, {
        orgId,
        onComplete: () => refreshItems(),
        postType: PostTypeEnum.prayer_request,
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
