import React, { useState } from 'react';
import {
  View,
  Keyboard,
  ScrollView,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';

import {
  ACTIONS,
  ANALYTICS_PERMISSION_TYPE,
  ANALYTICS_EDIT_MODE,
} from '../../../constants';
import { getAnalyticsPermissionType } from '../../../utils/analytics';
import { Input, Text, Button } from '../../../components/common';
import Header from '../../../components/Header';
import ImagePicker from '../../../components/ImagePicker';
import BackButton from '../../BackButton';
import theme from '../../../theme';
import { AuthState } from '../../../reducers/auth';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import {
  trackActionWithoutData,
  TrackStateContext,
} from '../../../actions/analytics';
import { navigateBack } from '../../../actions/navigation';
import { CommunityPost } from '../../../components/CelebrateItem/__generated__/CommunityPost';
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
  orgId: string;
}

interface UpdatePostNavParams {
  post: CommunityPost;
  onComplete: () => void;
  orgId: string;
}

type CreatePostScreenNavParams = CreatePostNavParams | UpdatePostNavParams;

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
    default:
      return '';
  }
};

export const CreatePostScreen = () => {
  const { t } = useTranslation('communityPost');
  const dispatch = useDispatch();

  const onComplete: () => void = useNavigationParam('onComplete');
  const orgId: string = useNavigationParam('orgId');
  const post: CommunityPost | undefined = useNavigationParam('post');
  const navPostType: PostTypeEnum | undefined = useNavigationParam('postType');

  const [postType, changePostType] = useState<PostTypeEnum>(
    post?.celebrateableType || navPostType,
  );
  const [postText, changePostText] = useState(
    post?.objectDescription || undefined,
  );
  const [postImage, changePostImage] = useState<ImageSourcePropType | null>(
    null,
  ); //preload post image if exists

  const analyticsPermissionType = useSelector<
    { auth: AuthState },
    permissionType
  >(({ auth }) => getAnalyticsPermissionType(auth, { id: orgId }));
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
        variables: { input: { id: post.celebrateableId, content: postText } },
      });
    } else {
      await createPost({
        variables: {
          input: { content: postText, communityId: orgId, postType },
        },
      }); //use new mutation, include image
      dispatch(trackActionWithoutData(ACTIONS.SHARE_STORY)); //TODO: new track action
    }

    onComplete();
    dispatch(navigateBack());
  };

  const handleSavePhoto = (image: ImageSourcePropType) =>
    changePostImage(image);

  const renderHeader = () => (
    <Header
      left={<BackButton iconStyle={styles.backButton} />}
      center={<Text style={styles.headerText}>{t(`${postType}.label`)}</Text>}
      right={
        postText ? (
          <Button onPress={savePost} testID="SavePostButton">
            <SendIcon style={styles.icon} />
          </Button>
        ) : null
      }
    />
  );

  const renderAddPhotoButton = () => (
    <ImagePicker onSelectImage={handleSavePhoto}>
      {postImage ? (
        <Image resizeMode="cover" source={postImage} style={styles.image} />
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
      <View
        style={{
          backgroundColor: 'blue',
          height: 20,
          width: 20,
          marginHorizontal: 35,
          marginVertical: 20,
        }}
      />
      <ScrollView style={{ flex: 1 }} contentInset={{ bottom: 90 }}>
        <Input
          testID="StoryInput"
          scrollEnabled={false}
          onChangeText={e => changePostText(e)}
          placeholder={t(`${postType}.placeholder`)}
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
