import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useMyId } from '../../../utils/hooks/useIsMe';
import { Button, Text } from '../../../components/common';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import Avatar from '../../../components/Avatar';
import { PostTypeEnum } from '../../../components/PostTypeLabel';
import CreatePostModal from '../CreatePostModal';

import styles from './styles';

interface CreatePostInputProps {
  type?: PostTypeEnum;
  communityId: string;
}

const CreatePostInput = ({ type, communityId }: CreatePostInputProps) => {
  const { t } = useTranslation('createPostScreen');
  const { container, inputButton, inputText } = styles;
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
      <Button style={inputButton} onPress={openModal} testID="CreatePostInput">
        <Avatar size="small" personId={personId} style={{ marginLeft: -15 }} />
        <Text style={inputText}>
          {type ? t(`${type}`) : t('inputPlaceholder')}
        </Text>
      </Button>
    </View>
  ) : null;
};

export default CreatePostInput;
