/* eslint max-lines: 0 */

import React, { useState } from 'react';
import {
  View,
  Keyboard,
  ScrollView,
  Image,
  StatusBar,
  Text,
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
//eslint-disable-next-line import/named
import { RecordResponse } from 'react-native-camera';
import { ReactNativeFile } from 'apollo-upload-client';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  ACTIONS,
  ANALYTICS_PERMISSION_TYPE,
  SAVE_PENDING_POST,
  DELETE_PENDING_POST,
  PENDING_POST_FAILED,
} from '../../../constants';
import { mapPostTypeToFeedType } from '../../../utils/common';
import { getPostTypeAnalytics } from '../../../utils/analytics';
import { Input, Button, Touchable } from '../../../components/common';
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
import { RootState } from '../../../reducers';
import {
  SavePendingPostAction,
  DeletePendingPostAction,
  PendingPostFailedAction,
  PendingUpdatePost,
  PendingCreatePost,
} from '../../../reducers/communityPosts';

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

const savePendingPost = (
  post: PendingCreatePost | PendingUpdatePost,
  storageId: string,
) => (dispatch: ThunkDispatch<RootState, never, AnyAction>) =>
  dispatch({
    type: SAVE_PENDING_POST,
    post,
    storageId,
  } as SavePendingPostAction);

export const deletePendingPost = (storageId: string) => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) =>
  dispatch({
    type: DELETE_PENDING_POST,
    storageId,
  } as DeletePendingPostAction);

const PendingPostFailed = (storageId: string) => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) =>
  dispatch({
    type: PENDING_POST_FAILED,
    storageId,
  } as PendingPostFailedAction);

export const useCreatePost = ({
  media,
  postType,
  communityId,
  mediaType,
  onComplete,
}: {
  media: string | null;
  postType: PostTypeEnum;
  communityId: string;
  mediaType: string | null;
  onComplete: () => void;
}) => {
  const hasImage = !!media && !!mediaType?.includes('image');
  const hasVideo = !!media && !!mediaType?.includes('video');

  const dispatch = useDispatch();
  const nextId = useSelector(
    ({ communityPosts }: RootState) => communityPosts.nextId,
  );
  const [storageId] = useState(`${nextId}`);

  const [createPost] = useMutation<CreatePost, CreatePostVariables>(
    CREATE_POST,
    {
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
      onCompleted: () => {
        dispatch(
          trackAction(ACTIONS.CREATE_POST.name, {
            [ACTIONS.CREATE_POST.key]: postType,
          }),
        );
        hasVideo && dispatch(deletePendingPost(storageId));
        hasImage && dispatch(trackActionWithoutData(ACTIONS.PHOTO_ADDED));
        hasVideo && dispatch(trackActionWithoutData(ACTIONS.VIDEO_ADDED));

        onComplete();
      },
      onError: () => {
        hasVideo && dispatch(PendingPostFailed(storageId));
      },
    },
  );

  const createFeedItem = (input: CreatePostInput) => {
    const pendingPost = input as PendingCreatePost;

    input.media &&
      hasVideo &&
      dispatch(savePendingPost(pendingPost, storageId));

    createPost({ variables: { input } });
  };

  return createFeedItem;
};

export const useUpdatePost = ({
  media,
  mediaType,
  onComplete,
}: {
  media: string | null;
  mediaType: string | null;
  onComplete: () => void;
}) => {
  const hasImage = !!media && !!mediaType?.includes('image');
  const hasVideo = !!media && !!mediaType?.includes('video');

  const dispatch = useDispatch();
  const nextId = useSelector(
    ({ communityPosts }: RootState) => communityPosts.nextId,
  );
  const [storageId] = useState(`${nextId}`);

  const [updatePost] = useMutation<UpdatePost, UpdatePostVariables>(
    UPDATE_POST,
    {
      onCompleted: () => {
        hasVideo && dispatch(deletePendingPost(storageId));
        hasImage && dispatch(trackActionWithoutData(ACTIONS.PHOTO_ADDED));
        hasVideo && dispatch(trackActionWithoutData(ACTIONS.VIDEO_ADDED));

        onComplete();
      },
      onError: () => {
        hasVideo && dispatch(PendingPostFailed(storageId));
      },
    },
  );

  const updateFeedItem = (input: UpdatePostInput, communityId: string) => {
    const pendingPost = { ...input, communityId } as PendingUpdatePost;

    input.media &&
      hasVideo &&
      dispatch(savePendingPost(pendingPost, storageId));

    updatePost({ variables: { input } });
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

  const hasImage = !!mediaType?.includes('image');
  const hasVideo = !!(videoEnabled && mediaType?.includes('video'));
  const mediaHasChanged = mediaData != post?.mediaExpiringUrl;

  const imageAspectRatio = useAspectRatio(hasImage ? mediaData : null);

  useAnalytics(['post', getPostTypeAnalytics(postType)], {
    permissionType: { communityId },
    editMode: { isEdit: !!post },
  });

  const createPost = useCreatePost({
    media: mediaData,
    communityId,
    postType,
    mediaType,
    onComplete,
  });
  const updatePost = useUpdatePost({ media: mediaData, mediaType, onComplete });

  const savePost = () => {
    if (!text && !hasVideo) {
      return;
    }

    Keyboard.dismiss();

    dispatch(navigateBack());

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
      updatePost({ id: post.id, content: text, media }, communityId);
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
    text || hasVideo ? (
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
