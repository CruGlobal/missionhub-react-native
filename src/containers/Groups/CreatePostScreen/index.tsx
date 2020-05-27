import React, { useState, useMemo } from 'react';
import { View, Keyboard, ScrollView, Image } from 'react-native';
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
import { getAnalyticsPermissionType } from '../../../utils/analytics';
import { Input, Text, Button, Touchable } from '../../../components/common';
import Header from '../../../components/Header';
import ImagePicker, {
  SelectImageParams,
} from '../../../components/ImagePicker';
import PostTypeLabel from '../../../components/PostTypeLabel';
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
import { CommunityFeedPost } from '../../../components/CommunityFeedItem/__generated__/CommunityFeedPost';
import { PostTypeEnum } from '../../../../__generated__/globalTypes';

import PhotoIcon from './photoIcon.svg';
import VideoIcon from './videoIcon.svg';
import CameraIcon from './cameraIcon.svg';
import { CREATE_POST, UPDATE_POST } from './queries';
import styles from './styles';
import { CreatePost, CreatePostVariables } from './__generated__/CreatePost';
import { UpdatePost, UpdatePostVariables } from './__generated__/UpdatePost';

type permissionType = TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];
type MediaType = 'NONE' | 'IMAGE' | 'VIDEO';

interface CreatePostScreenParams {
  onComplete: () => void;
  communityId: string;
}
interface CreatePostNavParams extends CreatePostScreenParams {
  postType: PostTypeEnum;
}
interface UpdatePostNavParams extends CreatePostScreenParams {
  post: CommunityFeedPost;
}
type CreatePostScreenNavParams = CreatePostNavParams | UpdatePostNavParams;

const EMPTY_IMAGE_URI = '/media/original/missing.png';

const getPostTypeAnalytics = (postType: PostTypeEnum) => {
  switch (postType) {
    case PostTypeEnum.story:
      return 'god story';
    case PostTypeEnum.prayer_request:
      return 'prayer request';
    case PostTypeEnum.question:
      return 'spritual question';
    case PostTypeEnum.help_request:
      return 'care request';
    case PostTypeEnum.thought:
      return 'whats on your mind';
    case PostTypeEnum.announcement:
      return 'announcement';
  }
};

export const CreatePostScreen = () => {
  const { t } = useTranslation('createPostScreen');
  const dispatch = useDispatch();

  const onComplete: () => void = useNavigationParam('onComplete');
  const communityId: string = useNavigationParam('communityId');
  const post: CommunityFeedPost | undefined = useNavigationParam('post');
  const navPostType: PostTypeEnum | undefined = useNavigationParam('postType');

  const [postType] = useState<PostTypeEnum>(
    post?.postType || navPostType || PostTypeEnum.story,
  );
  const [text, changeText] = useState<string>(post?.content || '');
  const [mediaType, changeMediaType] = useState<MediaType>('NONE');
  const [mediaData, changeMediaData] = useState<string | null>(null);
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

  const [createPost] = useMutation<CreatePost, CreatePostVariables>(
    CREATE_POST,
  );
  const [updatePost] = useMutation<UpdatePost, UpdatePostVariables>(
    UPDATE_POST,
  );

  const savePost = () => {
    if (!text) {
      return;
    }

    Keyboard.dismiss();

    if (post) {
      updatePost({
        variables: {
          input: {
            id: post.id,
            content: text,
            media: imageData === post.mediaExpiringUrl ? undefined : imageData,
          },
        },
      });
    } else {
      createPost({
        variables: {
          input: { content: text, communityId, postType, media: imageData },
        },
      });
      dispatch(trackActionWithoutData(ACTIONS.SHARE_STORY)); //TODO: new track action
    }

    onComplete();
    dispatch(navigateBack());
  };

  const handleSavePhoto = (image: SelectImageParams) => {
    changeMediaType('IMAGE');
    changeMediaData(image.data);
  };

  const handleSaveVideo = (uri: string) => {
    changeMediaType('VIDEO');
    changeMediaData(uri);
  };

  useMemo(() => {
    if (!mediaData) {
      return changeMediaHeight(0);
    }

    Image.getSize(
      mediaData,
      (width, height) => changeMediaHeight((height * theme.fullWidth) / width),
      () => {},
    );
  }, [mediaData]);

  const navigateToRecordVideo = () => {
    dispatch(
      navigatePush(RECORD_VIDEO_SCREEN, { onEndRecord: handleSaveVideo }),
    );
  };

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
      right={
        text ? (
          <Button
            type="transparent"
            onPress={savePost}
            testID="CreatePostButton"
            text={t('done')}
            style={styles.headerButton}
            buttonTextStyle={styles.createPostButtonText}
          />
        ) : null
      }
    />
  );

  const renderVideo = () => <View />; //render video

  const renderImage = () =>
    mediaData ? (
      // @ts-ignore
      <ImagePicker testID="ImagePicker" onSelectImage={handleSavePhoto}>
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
      <Touchable style={styles.addPhotoButton} onPress={navigateToRecordVideo}>
        <VideoIcon style={styles.icon} />
        <Text style={styles.addPhotoText}>{t('recordVideo')}</Text>
      </Touchable>
      <View style={styles.lineBreak} />

      <ImagePicker
        // @ts-ignore
        testID="ImagePicker"
        onSelectImage={handleSavePhoto}
      >
        <View style={styles.addPhotoButton}>
          <PhotoIcon style={styles.icon} />
          <Text style={styles.addPhotoText}>{t('addAPhoto')}</Text>
        </View>
      </ImagePicker>
      <View style={styles.lineBreak} />
    </>
  );

  const renderMedia = () => {
    switch (mediaType) {
      case 'NONE':
        return renderVideoPhotoButtons();
      case 'IMAGE':
        return renderImage();
      case 'VIDEO':
        return renderVideo();
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.lineBreak} />
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
