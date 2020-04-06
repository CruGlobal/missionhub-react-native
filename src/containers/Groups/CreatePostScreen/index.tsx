import React, { useState } from 'react';
import { View, Keyboard, ScrollView, Image } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';

import ADD_PHOTO_ICON from '../../../../assets/images/addPhotoIcon.png';
import SEND_ICON from '../../../../assets/images/sendIcon.png';
import {
  ACTIONS,
  ANALYTICS_PERMISSION_TYPE,
  ANALYTICS_EDIT_MODE,
} from '../../../constants';
import { getAnalyticsPermissionType } from '../../../utils/analytics';
import { Input, Text, Button } from '../../../components/common';
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
import { CreatePost, CreatePostVariables } from './__generated__/CreatePost';
import { UpdatePost, UpdatePostVariables } from './__generated__/UpdatePost';

type permissionType = TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];

export const CreatePostScreen = () => {
  const { t } = useTranslation('shareAStoryScreen');
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

  const savePost = async () => {
    if (!postText) {
      return null;
    }

    Keyboard.dismiss();

    if (post) {
      await updatePost({
        variables: { input: { id: post.id, content: postText } },
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

  const renderHeader = () => {
    return (
      <Header
        left={<BackButton iconStyle={styles.backButton} />}
        center={<Text style={styles.headerText}>God Story</Text>}
        right={
          postText ? (
            <Button onPress={savePost} testID="SavePostButton">
              <Image
                source={SEND_ICON}
                style={styles.icon}
                resizeMode="contain"
              />
            </Button>
          ) : null
        }
      />
    );
  };

  const renderAddPhotoButton = () =>
    postImage ? (
      <Image resizeMode="cover" source={postImage} style={styles.image} />
    ) : (
      <>
        <View style={styles.lineBreak} />
        <View style={styles.addPhotoButton}>
          <Image
            source={ADD_PHOTO_ICON}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={styles.addPhotoText}>Add a Photo</Text>
        </View>
        <View style={styles.lineBreak} />
      </>
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
          placeholder={t('inputPlaceholder')}
          value={postText}
          autoFocus={true}
          autoCorrect={true}
          multiline={true}
          selectionColor={theme.secondaryColor}
          placeholderTextColor={theme.lightGrey}
          style={styles.textInput}
        />
        <ImagePicker onSelectImage={handleSavePhoto}>
          {renderAddPhotoButton()}
        </ImagePicker>
      </ScrollView>
    </View>
  );
};

export const CREATE_POST_SCREEN = 'nav/CREATE_POST_SCREEN';
