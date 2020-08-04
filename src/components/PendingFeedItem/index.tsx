import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Video from 'react-native-video';
import { ReactNativeFile } from 'apollo-upload-client';

import CloseIcon from '../../../assets/images/closeIcon.svg';
import { Card, Touchable, Text } from '../common';
import {
  deletePendingPost,
  useCreatePost,
  useUpdatePost,
} from '../../containers/Groups/CreatePostScreen';
import { RootState } from '../../reducers';
import {
  StoredCreatePost,
  StoredUpdatePost,
} from '../../reducers/communityPosts';
import { PostTypeEnum } from '../../../__generated__/globalTypes';

import styles from './styles';

interface PendingFeedItemProps {
  pendingItemId: string;
  onComplete: () => void;
}

export const PendingFeedItem = ({
  pendingItemId,
  onComplete,
}: PendingFeedItemProps) => {
  const { t } = useTranslation('pendingPost');
  const dispatch = useDispatch();

  const post: StoredCreatePost | StoredUpdatePost = useSelector(
    ({ communityPosts }: RootState) =>
      communityPosts.pendingPosts[pendingItemId],
  );
  const { media, communityId, failed } = post;
  const postType = (post as StoredCreatePost).postType || PostTypeEnum.story;
  const isUpdate = !!(post as StoredUpdatePost).id;
  const uri = (media as ReactNativeFile).uri || '';

  const createPost = useCreatePost({
    media,
    postType,
    communityId,
    mediaType: 'video',
    onComplete,
  });
  const updatePost = useUpdatePost({
    media,
    mediaType: 'video',
    onComplete,
  });

  const handleRetry = () => {
    if (isUpdate) {
      const { id, media, content, communityId } = post as StoredUpdatePost;
      updatePost({ id, media, content }, communityId);
    } else {
      const {
        media,
        content,
        communityId,
        postType,
      } = post as StoredCreatePost;
      createPost({ media, content, postType, communityId });
    }
  };

  const handleCancel = () => {
    dispatch(deletePendingPost(pendingItemId));
  };

  const renderText = () => (
    <View style={styles.textWrapper}>
      {failed ? (
        <View>
          <Text style={styles.text}>{t('failed')}</Text>
          <Touchable testID="RetryButton" onPress={handleRetry}>
            <Text>{t('tryAgain')}</Text>
          </Touchable>
        </View>
      ) : (
        <Text style={styles.text}>{t('posting')}</Text>
      )}
    </View>
  );

  const renderEnd = () =>
    failed ? (
      <Touchable testID="CancelButton" onPress={handleCancel}>
        <CloseIcon />
      </Touchable>
    ) : (
      <ActivityIndicator size="small" color="rgba(0, 0, 0, 1)" />
    );

  return (
    <Card testID="PendingFeedItem" style={styles.container}>
      <Video
        style={{ height: 48, width: 48 }}
        source={{ uri }}
        controls={false}
        paused={true}
        resizeMode={'cover'}
      />
      {renderText()}
      {renderEnd()}
    </Card>
  );
};
