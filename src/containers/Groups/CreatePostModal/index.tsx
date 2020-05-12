import React from 'react';
import { View, Modal, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';

import { Flex } from '../../../components/common';
import PostTypeLabel, {
  PostLabelSizeEnum,
} from '../../../components/PostTypeLabel';
import CloseIcon from '../../../../assets/images/closeIcon.svg';
import LineIcon from '../../../../assets/images/lineIcon.svg';
import { AuthState } from '../../../reducers/auth';
import { isAdminOrOwner, mapPostTypeToFeedType } from '../../../utils/common';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { useMyId } from '../../../utils/hooks/useIsMe';
import { ANALYTICS_PERMISSION_TYPE } from '../../../constants';
import { getAnalyticsPermissionType } from '../../../utils/analytics';
import { navigatePush } from '../../../actions/navigation';
import { CREATE_POST_SCREEN } from '../CreatePostScreen';
import {
  PostTypeEnum,
  FeedItemSubjectTypeEnum,
} from '../../../../__generated__/globalTypes';
import theme from '../../../theme';

import {
  getMyCommunityPermission,
  getMyCommunityPermissionVariables,
} from './__generated__/getMyCommunityPermission';
import { GET_MY_COMMUNITY_PERMISSION_QUERY } from './queries';
import styles from './styles';

interface CreatePostModalProps {
  closeModal: () => void;
  communityId: string;
  refreshItems: () => void;
}

const CreatePostModal = ({
  closeModal,
  communityId,
  refreshItems,
}: CreatePostModalProps) => {
  const {
    modalStyle,
    containerStyle,
    closeButton,
    titleText,
    sectionTitle,
  } = styles;
  const { t } = useTranslation('createPostScreen');
  const dispatch = useDispatch();
  const personId = useMyId();
  const auth = useSelector(({ auth }: { auth: AuthState }) => auth);

  const { data: { community } = { community: undefined } } = useQuery<
    getMyCommunityPermission,
    getMyCommunityPermissionVariables
  >(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: communityId,
      myId: personId,
    },
  });
  const orgPermission = community?.people.edges[0].communityPermission;

  const adminOrOwner = orgPermission && isAdminOrOwner(orgPermission);

  useAnalytics(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]:
        community && getAnalyticsPermissionType(auth, community),
    },
  });

  const navigateToCreatePostScreen = (postType: PostTypeEnum) => {
    closeModal();
    return dispatch(
      navigatePush(CREATE_POST_SCREEN, {
        onComplete: refreshItems,
        communityId: community?.id,
        postType,
      }),
    );
  };

  const postTypeArray = [
    PostTypeEnum.story,
    PostTypeEnum.prayer_request,
    PostTypeEnum.question,
    PostTypeEnum.help_request,
    PostTypeEnum.thought,
  ];

  return (
    <Modal transparent animationType={'slide'} visible={true}>
      <View style={modalStyle}>
        <View style={[containerStyle]}>
          <Flex direction="row" justify="end" style={{ width: '100%' }}>
            <CloseIcon
              style={closeButton}
              testID="CloseButton"
              onPress={closeModal}
            />
          </Flex>
          <Text style={titleText}>{t('choosePostType')}</Text>
          {adminOrOwner ? (
            <Flex direction="row" justify="center" align="center">
              <LineIcon color={theme.extraLightGrey} />
              <Text style={sectionTitle}>{t('everyone')}</Text>
              <LineIcon color={theme.extraLightGrey} />
            </Flex>
          ) : null}
          {postTypeArray.map(type => (
            <View style={{ marginVertical: 10 }}>
              <PostTypeLabel
                key={type}
                type={mapPostTypeToFeedType(type)}
                size={PostLabelSizeEnum.large}
                onPress={() => navigateToCreatePostScreen(type)}
              />
            </View>
          ))}
          {adminOrOwner ? (
            <>
              <Flex
                direction="row"
                justify="center"
                align="center"
                style={{ marginTop: 20 }}
              >
                <LineIcon width="21" color={theme.grey} />
                <Text style={sectionTitle}>{t('ownersAndAdmins')}</Text>
                <LineIcon width="21" color={theme.grey} />
              </Flex>
              <View style={{ marginVertical: 10 }}>
                <PostTypeLabel
                  type={FeedItemSubjectTypeEnum.ANNOUNCEMENT}
                  size={PostLabelSizeEnum.large}
                  onPress={() =>
                    navigateToCreatePostScreen(PostTypeEnum.announcement)
                  }
                />
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};
export default CreatePostModal;
