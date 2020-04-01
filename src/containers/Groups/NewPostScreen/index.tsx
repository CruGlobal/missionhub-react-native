import React, { useState } from 'react';
import { View, Keyboard, ScrollView } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';

import {
  ACTIONS,
  ANALYTICS_PERMISSION_TYPE,
  ANALYTICS_EDIT_MODE,
} from '../../../constants';
import { getAnalyticsPermissionType } from '../../../utils/analytics';
import { Input } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
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

interface ShareStoryScreenProps {}

export const NewPostScreen = ({}: ShareStoryScreenProps) => {
  const { t } = useTranslation('shareAStoryScreen');
  const { container, backButton, textInput } = styles;
  const dispatch = useDispatch();
  const [post, changePost] = useState('');
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

  return (
    <View style={container}>
      <Header left={<BackButton iconStyle={backButton} />} />
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
