import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import { useMyId } from '../../../utils/hooks/useIsMe';
import { Button, Text } from '../../../components/common';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import Avatar from '../../../components/Avatar';
import { FeedItemSubjectTypeEnum } from '../../../../__generated__/globalTypes';
import CreatePostModal from '../CreatePostModal';
import { CREATE_POST_SCREEN } from '../CreatePostScreen';
import { isAdminOrOwner, mapFeedTypeToPostType } from '../../../utils/common';
import { navigatePush } from '../../../actions/navigation';

import {
  getMyCommunityPermission,
  getMyCommunityPermissionVariables,
} from './__generated__/getMyCommunityPermission';
import { GET_MY_COMMUNITY_PERMISSION_QUERY } from './queries';
import styles from './styles';

interface CreatePostButtonProps {
  refreshItems: () => void;
  type?: FeedItemSubjectTypeEnum;
  communityId: string;
}

export const CreatePostButton = ({
  refreshItems,
  type,
  communityId,
}: CreatePostButtonProps) => {
  const { t } = useTranslation('createPostScreen');
  const dispatch = useDispatch();
  const { container, button, buttonText } = styles;
  const personId = useMyId();
  const [isModalOpen, changeModalVisibility] = useState(false);

  const { data } = useQuery<
    getMyCommunityPermission,
    getMyCommunityPermissionVariables
  >(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: { id: communityId, myId: personId },
  });
  const orgPermission = data?.community.people.edges[0].communityPermission;

  const adminOrOwner = isAdminOrOwner(orgPermission);

  if (
    communityId === GLOBAL_COMMUNITY_ID ||
    (type && type === FeedItemSubjectTypeEnum.STEP) ||
    (type && type === FeedItemSubjectTypeEnum.ANNOUNCEMENT && !adminOrOwner)
  ) {
    return null;
  }

  const navigateToCreatePostScreen = () => {
    if (!type) {
      return;
    }
    const postType = mapFeedTypeToPostType(type);
    dispatch(
      navigatePush(CREATE_POST_SCREEN, {
        onComplete: refreshItems,
        communityId,
        postType,
      }),
    );
  };

  const openModal = () => {
    changeModalVisibility(true);
  };
  const closeModal = () => {
    changeModalVisibility(false);
  };

  return (
    <View style={container}>
      {isModalOpen ? (
        <CreatePostModal
          closeModal={closeModal}
          communityId={communityId}
          refreshItems={refreshItems}
          adminOrOwner={adminOrOwner}
        />
      ) : null}
      <Button
        style={button}
        onPress={type ? navigateToCreatePostScreen : openModal}
        testID="CreatePostButton"
      >
        <Avatar
          size="extrasmall"
          person={personId}
          style={{ marginLeft: -15 }}
        />
        <Text style={buttonText}>
          {type ? t(`createPostButton.${type}`) : t('inputPlaceholder')}
        </Text>
      </Button>
    </View>
  );
};
