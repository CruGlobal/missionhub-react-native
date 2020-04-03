import React, { useState } from 'react';
import { View, Keyboard, ScrollView, Image } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';

import ADD_PHOTO_ICON from '../../../../assets/images/addPhotoIcon.png';
import {
  ACTIONS,
  ANALYTICS_PERMISSION_TYPE,
  ANALYTICS_EDIT_MODE,
} from '../../../constants';
import { getAnalyticsPermissionType } from '../../../utils/analytics';
import { Input, Text } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
import ImagePicker, { imagePayload } from '../../../components/ImagePicker';
import BackButton from '../../BackButton';
import theme from '../../../theme';
import { AuthState } from '../../../reducers/auth';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import {
  trackActionWithoutData,
  TrackStateContext,
} from '../../../actions/analytics';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../../CelebrateFeed/__generated__/GetCelebrateFeed';

import { CREATE_POST, UPDATE_POST } from './queries';
import styles from './styles';
import { CreatePost, CreatePostVariables } from './__generated__/CreateAStory';
import { UpdatePost, UpdatePostVariables } from './__generated__/UpdateStory';

type permissionType = TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];

export const CreatePostScreen = () => {
  const { t } = useTranslation('shareAStoryScreen');
  const {
    container,
    headerText,
    lineBreak,
    addPhotoButton,
    addPhotoIcon,
    addPhotoText,
    image,
    backButton,
    textInput,
  } = styles;
  const onComplete: () => void = useNavigationParam('onComplete');
  const orgId: string = useNavigationParam('orgId');
  const post:
    | GetCelebrateFeed_community_celebrationItems_nodes
    | undefined = useNavigationParam('post'); //TODO: use post type
  const dispatch = useDispatch();
  const [postText, changePostText] = useState(
    post?.objectDescription || undefined,
  );
  const [postImage, changePostImage] = useState<imagePayload | null>(null); //preload post image if exists
  const analyticsPermissionType = useSelector<
    { auth: AuthState },
    permissionType
  >(({ auth }) => getAnalyticsPermissionType(auth, { id: orgId }));
  useAnalytics(['post', 'god story'], {
    //TODO: post type
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
      [ANALYTICS_EDIT_MODE]: post ? 'update' : 'set',
    },
  });
  const [createPost] = useMutation<CreatePost, CreatePostVariables>(
    CREATE_POST,
  ); //TODO: New Mutation
  const [updatePost] = useMutation<UpdatePost, UpdatePostVariables>(
    UPDATE_POST,
  ); //TODO: New Mutation

  const isEdit = !!post;

  const savePost = async () => {
    if (!postText) {
      return null;
    }

    Keyboard.dismiss();

    if (isEdit) {
      await updatePost({
        variables: { input: { id: post?.id, content: postText } },
      });
    } else {
      await createPost({
        variables: { input: { content: postText, organizationId: orgId } },
      });
    }

    dispatch(trackActionWithoutData(ACTIONS.SHARE_STORY)); //TODO: new track action

    onComplete();
  };

  const handleSavePhoto = (image: imagePayload) => {
    changePostImage(image);
  };

  const renderHeader = () => (
    <Header
      left={<BackButton iconStyle={backButton} />}
      center={<Text style={headerText}>God Story</Text>}
    />
  );

  const renderAddPhotoButton = () => (
    <>
      <View style={lineBreak} />
      <View style={addPhotoButton}>
        <Image
          source={ADD_PHOTO_ICON}
          resizeMode="contain"
          style={addPhotoIcon}
        />
        <Text style={addPhotoText}>Add a Photo</Text>
      </View>
      <View style={lineBreak} />
    </>
  );

  const renderImage = () =>
    image && <Image resizeMode="cover" source={image} style={postImage} />;

  return (
    <View style={container}>
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
          placeholder={t('inputPlaceholder')}
          value={postText}
          autoFocus={true}
          autoCorrect={true}
          multiline={true}
          selectionColor={theme.secondaryColor}
          placeholderTextColor={theme.lightGrey}
          style={textInput}
        />
        <ImagePicker onSelectImage={handleSavePhoto}>
          {image ? renderImage() : renderAddPhotoButton()}
        </ImagePicker>
      </ScrollView>
      <BottomButton
        text={t('shareStory')}
        onPress={savePost}
        testID="SavePostButton"
      />
    </View>
  );
};

export const CREATE_POST_SCREEN = 'nav/CREATE_POST_SCREEN';
