import React from 'react';
import { View, Modal, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { ACTIONS } from '../../../constants';
import { Flex } from '../../../components/common';
import PostTypeLabel, {
  PostLabelSizeEnum,
} from '../../../components/PostTypeLabel';
import LineIcon from '../../../../assets/images/lineIcon.svg';
import { mapPostTypeToFeedType } from '../../../utils/common';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { navigatePush } from '../../../actions/navigation';
import { trackAction } from '../../../actions/analytics';
import { CREATE_POST_SCREEN } from '../CreatePostScreen';
import CloseButton from '../../../components/CloseButton';
import {
  PostTypeEnum,
  FeedItemSubjectTypeEnum,
} from '../../../../__generated__/globalTypes';
import theme from '../../../theme';

import styles from './styles';

interface CreatePostModalProps {
  closeModal: () => void;
  communityId: string;
  adminOrOwner: boolean;
  onComplete: () => void;
}

const CreatePostModal = ({
  closeModal,
  communityId,
  adminOrOwner,
  onComplete,
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

  useAnalytics(['post', 'choose type']);

  const navigateToCreatePostScreen = (postType: PostTypeEnum) => {
    closeModal();

    dispatch(
      trackAction(ACTIONS.POST_TYPE_SELECTED.name, {
        [ACTIONS.POST_TYPE_SELECTED.key]: postType,
      }),
    );
    return dispatch(
      navigatePush(CREATE_POST_SCREEN, {
        communityId,
        postType,
        onComplete,
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
            <CloseButton style={closeButton} customNavigate={closeModal} />
          </Flex>
          <Text style={titleText}>{t('choosePostType')}</Text>
          {adminOrOwner ? (
            <Flex direction="row" justify="center" align="center">
              <LineIcon color={theme.extraLightGrey} />
              <Text style={sectionTitle}>{t('postAsYou')}</Text>
              <LineIcon color={theme.extraLightGrey} />
            </Flex>
          ) : null}
          {postTypeArray.map(type => (
            <View style={{ marginVertical: 10 }} key={type}>
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
                <LineIcon width="21" color={theme.extraLightGrey} />
                <Text style={sectionTitle}>{t('ownersAndAdmins')}</Text>
                <LineIcon width="21" color={theme.extraLightGrey} />
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
