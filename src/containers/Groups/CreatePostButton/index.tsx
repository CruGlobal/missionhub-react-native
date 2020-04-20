import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button, Text } from '../../../components/common';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import Avatar from '../../../components/Avatar';
import CreatePostModal from '../CreatePostModal';
import { useMyId } from '../../../utils/hooks/useIsMe';
import { PostTypeEnum } from '../../../../__generated__/globalTypes';

import styles from './styles';

interface CreatePostButtonProps {
  refreshItems: () => void;
  type?: PostTypeEnum;
  communityId: string;
}

export const CreatePostButton = ({
  refreshItems,
  type,
  communityId,
}: CreatePostButtonProps) => {
  const { t } = useTranslation('createPostScreen');
  const { container, button, buttonText } = styles;
  const personId = useMyId();
  const [isModalOpen, changeModalVisibility] = useState(false);

  const openModal = () => {
    changeModalVisibility(true);
  };
  const closeModal = () => {
    changeModalVisibility(false);
  };

  return communityId !== GLOBAL_COMMUNITY_ID ? (
    <View style={container}>
      {isModalOpen ? (
        <CreatePostModal closeModal={closeModal} communityId={communityId} />
      ) : null}
      <Button style={button} onPress={openModal} testID="CreatePostInput">
        <Avatar size="small" personId={personId} style={{ marginLeft: -15 }} />
        <Text style={buttonText}>
          {type ? t(`${type}`) : t('inputPlaceholder')}
        </Text>
      </Button>
    </View>
  ) : null;
};
