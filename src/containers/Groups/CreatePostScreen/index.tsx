import React, { useState } from 'react';
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
import { Input, Text, Button } from '../../../components/common';
import Header from '../../../components/Header';
import ImagePicker, {
  SelectImageParams,
} from '../../../components/ImagePicker';
import PostTypeLabel from '../../../components/PostTypeLabel';
import BackButton from '../../BackButton';
import theme from '../../../theme';
import { AuthState } from '../../../reducers/auth';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import {
  trackActionWithoutData,
  TrackStateContext,
} from '../../../actions/analytics';
import { navigateBack } from '../../../actions/navigation';
import { CommunityFeedPost } from '../../../components/CommunityFeedItem/__generated__/CommunityFeedPost';
import { PostTypeEnum } from '../../../../__generated__/globalTypes';

import SendIcon from './sendIcon.svg';
import CameraIcon from './cameraIcon.svg';
import { CREATE_POST, UPDATE_POST } from './queries';
import styles from './styles';
import { CreatePost, CreatePostVariables } from './__generated__/CreatePost';
import { UpdatePost, UpdatePostVariables } from './__generated__/UpdatePost';

type permissionType = TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];

interface CreatePostNavParams {
  postType: PostTypeEnum;
  onComplete: () => void;
  communityId: string;
}

interface UpdatePostNavParams {
  post: CommunityFeedPost;
  onComplete: () => void;
  communityId: string;
}

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
  const [postText, changePostText] = useState<string>(post?.content || '');
  const [postImage, changePostImage] = useState<string | undefined>(undefined); //TODO: use image from post

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

  const savePost = async () => {
    if (!postText) {
      return;
    }

    Keyboard.dismiss();

    if (post) {
      await updatePost({
        variables: { input: { id: post.id, content: postText } },
      });
    } else {
      await createPost({
        variables: {
          input: { content: postText, communityId, postType },
        },
      });
      dispatch(trackActionWithoutData(ACTIONS.SHARE_STORY)); //TODO: new track action
    }

    onComplete();
    dispatch(navigateBack());
  };

  const handleSavePhoto = (image: SelectImageParams) =>
    changePostImage(image.data);

  const renderHeader = () => (
    <Header
      left={<BackButton iconStyle={styles.backButton} />}
      center={
        <Text style={styles.headerText}>
          {t(`postTypes:${mapPostTypeToFeedType(postType)}`)}
        </Text>
      }
      right={
        postText ? (
          <Button onPress={savePost} testID="CreatePostButton">
            <SendIcon style={styles.icon} />
          </Button>
        ) : null
      }
    />
  );

  const renderAddPhotoButton = () => (
    <ImagePicker onSelectImage={handleSavePhoto}>
      {postImage ? (
        <Image
          resizeMode="contain"
          source={{ uri: postImage }}
          style={styles.image}
        />
      ) : (
        <>
          <View style={styles.lineBreak} />
          <View style={styles.addPhotoButton}>
            <CameraIcon style={styles.icon} />
            <Text style={styles.addPhotoText}>{t('addAPhoto')}</Text>
          </View>
          <View style={styles.lineBreak} />
        </>
      )}
    </ImagePicker>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView style={{ flex: 1 }} contentInset={{ bottom: 90 }}>
        <View style={styles.postLabelRow}>
          <PostTypeLabel type={mapPostTypeToFeedType(postType)} />
        </View>
        <Input
          testID="PostInput"
          scrollEnabled={false}
          onChangeText={e => changePostText(e)}
          placeholder={t(`placeholder.${postType}`)}
          value={postText}
          autoFocus={true}
          autoCorrect={true}
          multiline={true}
          selectionColor={theme.secondaryColor}
          placeholderTextColor={theme.lightGrey}
          style={styles.textInput}
        />
        {renderAddPhotoButton()}
      </ScrollView>
    </View>
  );
};

export const CREATE_POST_SCREEN = 'nav/CREATE_POST_SCREEN';
