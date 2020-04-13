import React from 'react';
import { View, Modal, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Flex } from '../../../components/common';
import IconButton from '../../../components/IconButton';
import PostTypeLabel, {
  PostTypeEnum,
  PostLabelSizeEnum,
} from '../../../components/PostTypeLabel';
import { trackAction as analyticsTrackAction } from '../../../actions/analytics';

import styles from './styles';

const CreatePostModal = ({ closeModal }: { closeModal: () => void }) => {
  const { modalStyle, containerStyle, closeButton, titleText } = styles;
  const { t } = useTranslation('createPostScreen');
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
        <View style={containerStyle}>
          <Flex direction="row" justify="end" style={{ width: '100%' }}>
            <IconButton
              testID="CloseButton"
              style={closeButton}
              onPress={() => closeModal()}
              name="close"
              type="Material"
              size={32}
            />
          </Flex>
          <Text style={titleText}>{t('choosePostType')}</Text>
          {postTypeArray.map(type => (
            <PostTypeLabel type={type} size={PostLabelSizeEnum.large} />
          ))}
        </View>
      </View>
    </Modal>
  );
};
export default CreatePostModal;
