import React, { useState } from 'react';
import { View, Keyboard, ScrollView, Image } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
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
import { Input, Text, Button } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
import ImagePicker from '../../../components/ImagePicker';
import BackButton from '../../BackButton';
import theme from '../../../theme';
import { AuthState } from '../../../reducers/auth';
import { Organization } from '../../../reducers/organizations';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import {
  trackActionWithoutData,
  TrackStateContext,
} from '../../../actions/analytics';

import styles from './styles';
import {
  CreateAStory,
  CreateAStoryVariables,
} from './__generated__/CreateAStory';

export const CREATE_A_STORY = gql`
  mutation CreateAStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      story {
        id
      }
    }
  }
`;

type permissionType = TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];

export const NewPostScreen = () => {
  const { t } = useTranslation('shareAStoryScreen');
  const {
    container,
    headerText,
    lineBreak,
    addPhotoButton,
    addPhotoIcon,
    addPhotoText,
    backButton,
    textInput,
  } = styles;
  const dispatch = useDispatch();
  const [post, changePost] = useState('');
  const [image, changeImage] = useState<null>(null);
  const onComplete: () => void = useNavigationParam('onComplete');
  const organization: Organization = useNavigationParam('organization');
  const analyticsPermissionType = useSelector<
    { auth: AuthState },
    permissionType
  >(({ auth }) => getAnalyticsPermissionType(auth, organization));
  useAnalytics(['post', 'share'], {
    //TODO: post type
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
      [ANALYTICS_EDIT_MODE]: 'set',
    },
  });
  const [createPost] = useMutation<CreateAStory, CreateAStoryVariables>(
    CREATE_A_STORY,
  ); //TODO: New Mutation

  const savePost = async () => {
    if (!post) {
      return null;
    }
    Keyboard.dismiss();
    await createPost({
      variables: { input: { content: post, organizationId: organization.id } },
    });
    dispatch(trackActionWithoutData(ACTIONS.SHARE_STORY)); //TODO: new track action

    onComplete();
  };

  const handleSavePhoto = image => {
    changeImage(image);
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
      <Button onPress={handlePressAddPhoto} style={addPhotoButton}>
        <Image
          source={ADD_PHOTO_ICON}
          resizeMode="contain"
          style={addPhotoIcon}
        />
        <Text style={addPhotoText}>Add a Photo</Text>
      </Button>
      <View style={lineBreak} />
    </>
  );

  const renderImage = () => <Image source={image} />;

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
          onChangeText={e => changePost(e)}
          placeholder={t('inputPlaceholder')}
          value={post}
          autoFocus={true}
          autoCorrect={true}
          multiline={true}
          selectionColor={theme.secondaryColor}
          placeholderTextColor={theme.lightGrey}
          style={textInput}
        />
        <ImagePicker>{renderAddPhotoButton()}</ImagePicker>
      </ScrollView>
      <BottomButton
        text={t('shareStory')}
        onPress={savePost}
        testID="SavePostButton"
      />
    </View>
  );
};

export const CELEBRATE_SHARE_STORY_SCREEN = 'nav/CELEBRATE_SHARE_STORY_SCREEN';
