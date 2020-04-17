import React from 'react';
import { View, Modal, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';

import { Flex } from '../../../components/common';
import PostTypeLabel, {
  PostTypeEnum,
  PostLabelSizeEnum,
} from '../../../components/PostTypeLabel';
import CloseIcon from '../../../../assets/images/closeIcon.svg';
import LineIcon from '../../../../assets/images/lineIcon.svg';
import { AuthState } from '../../../reducers/auth';
import { isAdminOrOwner } from '../../../utils/common';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { useMyId } from '../../../utils/hooks/useIsMe';
import { ANALYTICS_PERMISSION_TYPE } from '../../../constants';
import { getAnalyticsPermissionType } from '../../../utils/analytics';
import { navigatePush } from '../../../actions/navigation';
import { CELEBRATE_SHARE_STORY_SCREEN } from '../ShareStoryScreen';
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
}

const CreatePostModal = ({ closeModal, communityId }: CreatePostModalProps) => {
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
  community &&
    useAnalytics(['post', 'choose type'], {
      screenContext: {
        [ANALYTICS_PERMISSION_TYPE]: getAnalyticsPermissionType(
          auth,
          community,
        ),
      },
    });

  const navigateToCreatePostScreen = (type: PostTypeEnum) => {
    closeModal();
    return dispatch(
      navigatePush(CELEBRATE_SHARE_STORY_SCREEN, {
        communityId: community?.id,
        type,
      }),
    );
  };

  const postTypeArray = [
    PostTypeEnum.godStory,
    PostTypeEnum.prayerRequest,
    PostTypeEnum.spiritualQuestion,
    PostTypeEnum.careRequest,
    PostTypeEnum.onYourMind,
  ];

  return (
    <Modal transparent animationType={'slide'} visible={true}>
      <View style={modalStyle}>
        <View style={[containerStyle, { flex: adminOrOwner ? 0.6 : 0.5 }]}>
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
            <PostTypeLabel
              key={type}
              type={type}
              size={PostLabelSizeEnum.large}
              onPress={() => navigateToCreatePostScreen(type)}
            />
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
              <PostTypeLabel
                type={PostTypeEnum.announcement}
                size={PostLabelSizeEnum.large}
                onPress={() =>
                  navigateToCreatePostScreen(PostTypeEnum.announcement)
                }
              />
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};
export default CreatePostModal;
