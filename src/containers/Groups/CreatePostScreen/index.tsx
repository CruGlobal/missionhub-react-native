/* eslint max-lines: 0 */

import React, { useState, useMemo } from 'react';
import { View, Keyboard, ScrollView, Image, StatusBar } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';
//eslint-disable-next-line import/named
import { RecordResponse } from 'react-native-camera';
//eslint-disable-next-line import/named
import { ReactNativeFile } from 'apollo-upload-client';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  ACTIONS,
  ANALYTICS_PERMISSION_TYPE,
  SAVE_PENDING_CREATE_POST,
  SAVE_PENDING_UPDATE_POST,
  DELETE_PENDING_CREATE_POST,
  DELETE_PENDING_UPDATE_POST,
  PENDING_CREATE_POST_FAILED,
  PENDING_UPDATE_POST_FAILED,
} from '../../../constants';
import { mapPostTypeToFeedType } from '../../../utils/common';
import { getPostTypeAnalytics } from '../../../utils/analytics';
import { Input, Text, Button, Touchable } from '../../../components/common';
import Header from '../../../components/Header';
import ImagePicker, {
  SelectImageParams,
} from '../../../components/ImagePicker';
import PostTypeLabel from '../../../components/PostTypeLabel';
import VideoPlayer from '../../../components/VideoPlayer';
import { RECORD_VIDEO_SCREEN } from '../../RecordVideoScreen';
import BackButton from '../../../components/BackButton';
import theme from '../../../theme';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import {
  trackActionWithoutData,
  TrackStateContext,
  trackAction,
} from '../../../actions/analytics';
import { navigateBack, navigatePush } from '../../../actions/navigation';
import {
  PostTypeEnum,
  CreatePostInput,
  UpdatePostInput,
} from '../../../../__generated__/globalTypes';
import { CommunityFeedItem_subject_Post } from '../../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { GET_COMMUNITY_FEED } from '../../CommunityFeed/queries';
import {
  GetCommunityFeed,
  GetCommunityFeedVariables,
} from '../../CommunityFeed/__generated__/GetCommunityFeed';
import { useAspectRatio } from '../../../utils/hooks/useAspectRatio';
import { useFeatureFlags } from '../../../utils/hooks/useFeatureFlags';

import PhotoIcon from './photoIcon.svg';
import VideoIcon from './videoIcon.svg';
import SendIcon from './sendIcon.svg';
import { CREATE_POST, UPDATE_POST } from './queries';
import styles from './styles';
import { CreatePost, CreatePostVariables } from './__generated__/CreatePost';
import { UpdatePost, UpdatePostVariables } from './__generated__/UpdatePost';

type permissionType = TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];

interface CreatePostScreenParams {
  onComplete: () => void;
  communityId: string;
}
interface CreatePostNavParams extends CreatePostScreenParams {
  postType: PostTypeEnum;
}
interface UpdatePostNavParams extends CreatePostScreenParams {
  post: CommunityFeedItem_subject_Post;
}
export type CreatePostScreenNavParams =
  | CreatePostNavParams
  | UpdatePostNavParams;

const savePendingCreatePost = (post: CreatePostInput) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => dispatch({ type: SAVE_PENDING_CREATE_POST, post });

const savePendingUpdatePost = (post: UpdatePostInput) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => dispatch({ type: SAVE_PENDING_UPDATE_POST, post });

const deletePendingPost = (postId: string, update: boolean) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) =>
  dispatch({
    type: update ? DELETE_PENDING_UPDATE_POST : DELETE_PENDING_CREATE_POST,
    postId,
  });

const PendingPostFailed = (postId: string, update: boolean) => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) =>
  dispatch({
    type: update ? PENDING_UPDATE_POST_FAILED : PENDING_CREATE_POST_FAILED,
    postId,
  });

const useCreatePost = (
  post: CreatePostInput,
  onComplete: (update: boolean, includesMedia: boolean) => void,
) => {
  const { communityId, postType, media } = post;

  const dispatch = useDispatch();
  const [createPost, { error, data }] = useMutation<
    CreatePost,
    CreatePostVariables
  >(CREATE_POST, {
    update: (cache, { data }) => {
      try {
        const originalData = cache.readQuery<
          GetCommunityFeed,
          GetCommunityFeedVariables
        >({
          query: GET_COMMUNITY_FEED,
          variables: { communityId },
        });
        cache.writeQuery({
          query: GET_COMMUNITY_FEED,
          variables: { communityId },
          data: {
            ...originalData,
            community: {
              ...originalData?.community,
              feedItems: {
                ...originalData?.community.feedItems,
                nodes: [
                  data?.createPost?.post?.feedItem,
                  ...(originalData?.community.feedItems.nodes || []),
                ],
              },
            },
          },
        });
      } catch {}

      try {
        const originalFilteredData = cache.readQuery<
          GetCommunityFeed,
          GetCommunityFeedVariables
        >({
          query: GET_COMMUNITY_FEED,
          variables: {
            communityId,
            subjectType: [mapPostTypeToFeedType(postType)],
          },
        });
        cache.writeQuery({
          query: GET_COMMUNITY_FEED,
          variables: {
            communityId,
            subjectType: mapPostTypeToFeedType(postType),
          },
          data: {
            ...originalFilteredData,
            community: {
              ...originalFilteredData?.community,
              feedItems: {
                ...originalFilteredData?.community.feedItems,
                nodes: [
                  data?.createPost?.post?.feedItem,
                  ...(originalFilteredData?.community.feedItems.nodes || []),
                ],
              },
            },
          },
        });
      } catch {}
    },
  });

  useMemo(() => {
    if (data) {
      media && dispatch(deletePendingPost(media, false));

      onComplete(false, !!media);
    }
  }, [data]);

  useMemo(() => {
    if (error) {
      media && dispatch(PendingPostFailed(media, false));
    }
  }, [error]);

  const createFeedItem = (postInput: CreatePostInput) => {
    media && dispatch(savePendingCreatePost(postInput));

    createPost({ variables: { input: postInput } });
  };

  return createFeedItem;
};

export const useUpdatePost = (
  post: UpdatePostInput,
  onComplete: (update: boolean, includesMedia: boolean) => void,
) => {
  const { media } = post;

  const dispatch = useDispatch();
  const [updatePost, { error, data }] = useMutation<
    UpdatePost,
    UpdatePostVariables
  >(UPDATE_POST);

  useMemo(() => {
    if (data) {
      media && dispatch(deletePendingPost(media, true));

      onComplete(true, !!media);
    }
  }, [data]);

  useMemo(() => {
    if (error) {
      media && dispatch(PendingPostFailed(media, true));
    }
  }, [error]);

  const updateFeedItem = (postInput: UpdatePostInput) => {
    media && dispatch(savePendingUpdatePost(postInput));

    updatePost({ variables: { input: postInput } });
  };

  return updateFeedItem;
};

export const CreatePostScreen = () => {
  const { t } = useTranslation('createPostScreen');
  const dispatch = useDispatch();

  const communityId: string = useNavigationParam('communityId');
  const onComplete: () => void = useNavigationParam('onComplete');
  const post: CommunityFeedItem_subject_Post | undefined = useNavigationParam(
    'post',
  );
  const navPostType: PostTypeEnum | undefined = useNavigationParam('postType');

  const [postType] = useState<PostTypeEnum>(
    post?.postType || navPostType || PostTypeEnum.story,
  );
  const [text, changeText] = useState<string>(post?.content || '');
  const [mediaType, changeMediaType] = useState<string | null>(
    post?.mediaContentType || null,
  );
  const [mediaData, changeMediaData] = useState<string | null>(
    post?.mediaExpiringUrl || null,
  );
  const { video: videoEnabled } = useFeatureFlags();

  const hasImage = mediaType?.includes('image');
  const hasVideo = videoEnabled && mediaType?.includes('video');

  const imageAspectRatio = useAspectRatio(hasImage ? mediaData : null);

  useAnalytics(['post', getPostTypeAnalytics(postType)], {
    permissionType: { communityId },
    editMode: { isEdit: !!post },
  });

  const handleComplete = (update: boolean, includesMedia: boolean) => {
    !update &&
      dispatch(
        trackAction(ACTIONS.CREATE_POST.name, {
          [ACTIONS.CREATE_POST.key]: postType,
        }),
      );
    includesMedia &&
      hasImage &&
      dispatch(trackActionWithoutData(ACTIONS.PHOTO_ADDED));
    includesMedia &&
      hasVideo &&
      dispatch(trackActionWithoutData(ACTIONS.VIDEO_ADDED));

    onComplete();
  };

  const createPost = useCreatePost(
    { content: text, communityId, postType, media: mediaData },
    handleComplete,
  );
  const updatePost = useUpdatePost(
    { id: '', content: text, media: mediaData },
    handleComplete,
  );

  const savePost = () => {
    if (!text) {
      return;
    }

    Keyboard.dismiss();

    dispatch(navigateBack());

    const mediaHasChanged = mediaData != post?.mediaExpiringUrl;

    const media: string | ReactNativeFile | undefined =
      mediaData && mediaType && hasImage && mediaHasChanged
        ? mediaData
        : mediaData && mediaType && hasVideo && mediaHasChanged
        ? new ReactNativeFile({
            name: 'upload',
            uri: mediaData,
            type: mediaType,
          })
        : undefined;

    if (post) {
      updatePost({ id: post.id, content: text, media });
    } else {
      createPost({ content: text, communityId, postType, media });
    }
  };

  const handleSavePhoto = (image: SelectImageParams) => {
    const { data, fileType } = image;
    changeMediaType(`image/${fileType}`);
    changeMediaData(data);
  };

  const handleSaveVideo = (response: RecordResponse) => {
    const { uri, codec = 'mp4' } = response;
    changeMediaType(`video/${String(codec)}`);
    changeMediaData(uri);
  };

  const navigateToRecordVideo = () => {
    dispatch(
      navigatePush(RECORD_VIDEO_SCREEN, { onEndRecord: handleSaveVideo }),
    );
  };

  const handleDeleteVideo = () => {
    changeMediaType(null);
    changeMediaData(null);
  };

  const renderSendButton = () =>
    text ? (
      post ? (
        <Button
          type="transparent"
          onPress={savePost}
          testID="CreatePostButton"
          text={t('done')}
          style={styles.headerButton}
          buttonTextStyle={styles.createPostButtonText}
        />
      ) : (
        <Button
          type="transparent"
          onPress={savePost}
          testID="CreatePostButton"
          style={styles.headerButton}
        >
          <SendIcon style={styles.icon} />
        </Button>
      )
    ) : null;

  const renderHeader = () => (
    <Header
      left={
        <BackButton style={styles.headerButton} iconColor={theme.textColor} />
      }
      center={
        <Text style={styles.headerText}>
          {t(`postTypes:${mapPostTypeToFeedType(postType)}`)}
        </Text>
      }
      right={renderSendButton()}
    />
  );

  const renderVideoPhotoButtons = () => (
    <>
      {videoEnabled ? (
        <>
          <View style={styles.lineBreak} />
          <Touchable
            testID="VideoButton"
            style={styles.addPhotoButton}
            onPress={navigateToRecordVideo}
          >
            <VideoIcon style={styles.icon} />
            <Text style={styles.addPhotoText}>{t('recordVideo')}</Text>
          </Touchable>
        </>
      ) : null}
      <View style={styles.lineBreak} />
      <ImagePicker onSelectImage={handleSavePhoto} showCropper={false}>
        <View style={styles.addPhotoButton}>
          <PhotoIcon style={styles.icon} />
          <Text style={styles.addPhotoText}>{t('addAPhoto')}</Text>
        </View>
      </ImagePicker>
      <View style={styles.lineBreak} />
    </>
  );

  const renderMedia = () =>
    mediaData && hasImage ? (
      <ImagePicker onSelectImage={handleSavePhoto} showCropper={false}>
        <Image
          resizeMode="contain"
          source={{ uri: mediaData }}
          style={{
            width: theme.fullWidth,
            aspectRatio: imageAspectRatio,
          }}
        />
      </ImagePicker>
    ) : mediaData && hasVideo ? (
      <VideoPlayer
        uri={mediaData}
        onDelete={handleDeleteVideo}
        width={theme.fullWidth}
      />
    ) : (
      renderVideoPhotoButtons()
    );

  return (
    <View style={styles.container}>
      <StatusBar {...theme.statusBar.darkContent} />
      {renderHeader()}
      <View style={styles.lineBreak} />
      <ScrollView
        style={{ flex: 1 }}
        contentInset={{ bottom: 90 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.postLabelRow}>
          <PostTypeLabel type={mapPostTypeToFeedType(postType)} />
        </View>
        <Input
          testID="PostInput"
          scrollEnabled={false}
          onChangeText={e => changeText(e)}
          placeholder={t(`placeholder.${postType}`)}
          value={text}
          autoFocus={true}
          autoCorrect={true}
          multiline={true}
          selectionColor={theme.secondaryColor}
          placeholderTextColor={theme.lightGrey}
          style={styles.textInput}
        />
        {renderMedia()}
      </ScrollView>
    </View>
  );
};

export const CREATE_POST_SCREEN = 'nav/CREATE_POST_SCREEN';
