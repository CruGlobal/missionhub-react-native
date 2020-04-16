import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';

import { useMyId } from '../../../utils/hooks/useIsMe';
import { Button, Text } from '../../../components/common';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import Avatar from '../../../components/Avatar';
import { PostTypeEnum } from '../../../components/PostTypeLabel';
import CreatePostModal from '../CreatePostModal';

import { GET_MY_COMMUNITY_PERMISSION_QUERY } from './queries';
import {
  getMyCommunityPermission,
  getMyCommunityPermissionVariables,
} from './__generated__/getMyCommunityPermission';
import styles from './styles';

interface CreatePostInputProps {
  type?: PostTypeEnum;
  orgId: string;
}

const CreatePostInput = ({ type, orgId }: CreatePostInputProps) => {
  const { t } = useTranslation('createPostScreen');
  const { container, inputButton, inputText } = styles;
  const personId = useMyId();
  const [isModalOpen, changeModalVisibility] = useState(false);

  const { data: { community } = { community: undefined } } = useQuery<
    getMyCommunityPermission,
    getMyCommunityPermissionVariables
  >(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: orgId,
      myId: personId,
    },
    skip: orgId === GLOBAL_COMMUNITY_ID,
  });

  const openModal = () => {
    changeModalVisibility(true);
  };
  const closeModal = () => {
    changeModalVisibility(false);
  };

  return community && community?.id !== GLOBAL_COMMUNITY_ID ? (
    <View style={container}>
      {isModalOpen ? (
        <CreatePostModal closeModal={closeModal} community={community} />
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
