/* eslint max-lines: 0 */

import React, { useState, useEffect } from 'react';
import { View, Keyboard, ScrollView, Image, StatusBar } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';

import {
  ACTIONS,
  ANALYTICS_PERMISSION_TYPE,
  ANALYTICS_EDIT_MODE,
} from '../../../constants';
import { mapPostTypeToFeedType } from '../../../utils/common';
import {
  getAnalyticsPermissionType,
  getPostTypeAnalytics,
} from '../../../utils/analytics';
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
import { AuthState } from '../../../reducers/auth';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import {
  trackActionWithoutData,
  TrackStateContext,
} from '../../../actions/analytics';
import { navigateBack, navigatePush } from '../../../actions/navigation';
import { PostTypeEnum } from '../../../../__generated__/globalTypes';
import { CommunityFeedItem_subject_Post } from '../../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { GET_COMMUNITY_FEED } from '../../CommunityFeed/queries';
import { ErrorNotice } from '../../../components/ErrorNotice/ErrorNotice';
import {
  GetCommunityFeed,
  GetCommunityFeedVariables,
} from '../../CommunityFeed/__generated__/GetCommunityFeed';

import PhotoIcon from './photoIcon.svg';
import VideoIcon from './videoIcon.svg';
import SendIcon from './sendIcon.svg';
import { CREATE_POST, UPDATE_POST } from './queries';
import styles from './styles';
import { CreatePost, CreatePostVariables } from './__generated__/CreatePost';
import { UpdatePost, UpdatePostVariables } from './__generated__/UpdatePost';

type permissionType = TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];
type MediaType = 'image' | 'video' | null;

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

export const CreatePostScreen = () => {
  const { t } = useTranslation('createPostScreen');
  const dispatch = useDispatch();

  const communityId: string = useNavigationParam('communityId');
  const post: CommunityFeedItem_subject_Post | undefined = useNavigationParam(
    'post',
  );
  const navPostType: PostTypeEnum | undefined = useNavigationParam('postType');

  const [postType] = useState<PostTypeEnum>(
    post?.postType || navPostType || PostTypeEnum.story,
  );
  const [text, changeText] = useState<string>(post?.content || '');
  const [mediaType, changeMediaType] = useState<MediaType>(
    (post?.mediaContentType || null) as MediaType,
  );
  const [mediaData, changeMediaData] = useState<string | null>(
    post?.mediaExpiringUrl || null,
  );
  const [mediaHeight, changeMediaHeight] = useState<number>(0);

  const analyticsPermissionType = useSelector<
    { auth: AuthState },
    permissionType
  >(({ auth }) => getAnalyticsPermissionType(auth, { id: communityId }));
  useAnalytics(['post', getPostTypeAnalytics(postType)], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
      [ANALYTICS_EDIT_MODE]: post ? 'update' : 'set',
    },
  });

  const [createPost, { error: errorCreatePost }] = useMutation<
    CreatePost,
    CreatePostVariables
  >(CREATE_POST, {
    update: (cache, { data }) => {
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
  const [updatePost, { error: errorUpdatePost }] = useMutation<
    UpdatePost,
    UpdatePostVariables
  >(UPDATE_POST);

  const hasImage = mediaType?.includes('image');
  const hasVideo = mediaType?.includes('video');

  const getMediaHeight = () => {
    if (!mediaData) {
      return changeMediaHeight(0);
    }

    if (hasImage) {
      return Image.getSize(
        mediaData,
        (width, height) =>
          changeMediaHeight((height * theme.fullWidth) / width),
        () => {},
      );
    }
    if (hasVideo) {
      return changeMediaHeight(theme.fullHeight); //dimensions of video are full height and width of phone
    }
  };

  useEffect(() => {
    getMediaHeight();
  }, [mediaData]);

  const savePost = async () => {
    if (!text) {
      return;
    }

    Keyboard.dismiss();

    if (post) {
      await updatePost({
        variables: {
          input: {
            id: post.id,
            content: text,
            media:
              hasImage && mediaData !== post.mediaExpiringUrl
                ? mediaData
                : undefined,
          },
        },
      });
    } else {
      await createPost({
        variables: {
          input: {
            content: text,
            communityId,
            postType,
            media: hasImage ? mediaData : null,
          },
        },
      });
      dispatch(trackActionWithoutData(ACTIONS.SHARE_STORY)); //TODO: new track action
    }

    dispatch(navigateBack());
  };

  const handleSavePhoto = (image: SelectImageParams) => {
    changeMediaType('image');
    changeMediaData(image.data);
  };

  const handleSaveVideo = (uri: string) => {
    changeMediaType('video');
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

  const renderVideo = () =>
    mediaData ? (
      <VideoPlayer
        uri={mediaData}
        style={{ width: theme.fullWidth, height: mediaHeight }}
        onDelete={handleDeleteVideo}
      />
    ) : null;

  const renderImage = () =>
    mediaData ? (
      <ImagePicker onSelectImage={handleSavePhoto}>
        <Image
          resizeMode="contain"
          source={{ uri: mediaData }}
          style={{ width: theme.fullWidth, height: mediaHeight }}
        />
      </ImagePicker>
    ) : null;

  const renderVideoPhotoButtons = () => (
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
      <View style={styles.lineBreak} />
      <ImagePicker onSelectImage={handleSavePhoto}>
        <View style={styles.addPhotoButton}>
          <PhotoIcon style={styles.icon} />
          <Text style={styles.addPhotoText}>{t('addAPhoto')}</Text>
        </View>
      </ImagePicker>
      <View style={styles.lineBreak} />
    </>
  );

  const renderMedia = () =>
    hasImage
      ? renderImage()
      : hasVideo
      ? renderVideo()
      : renderVideoPhotoButtons();

  return (
    <View style={styles.container}>
      <StatusBar {...theme.statusBar.darkContent} />
      {renderHeader()}
      <View style={styles.lineBreak} />
      <ErrorNotice
        message={t('errorCreatingPost')}
        error={errorCreatePost}
        refetch={savePost}
      />
      <ErrorNotice
        message={t('errorUpdatingPost')}
        error={errorUpdatePost}
        refetch={savePost}
      />
      <ScrollView style={{ flex: 1 }} contentInset={{ bottom: 90 }}>
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
