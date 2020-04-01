import React, { useState } from 'react';
import { View, Keyboard, ScrollView } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';

import { Input } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
import { TrackStateContext } from '../../../actions/analytics';
import { navigateBack } from '../../../actions/navigation';
import BackButton from '../../BackButton';
import theme from '../../../theme';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { ANALYTICS_PERMISSION_TYPE } from '../../../constants';
import { getAnalyticsPermissionType } from '../../../utils/analytics';
import { AuthState } from '../../../reducers/auth';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../../CelebrateFeed/__generated__/GetCelebrateFeed';

import styles from './styles';
import { UpdateStory, UpdateStoryVariables } from './__generated__/UpdateStory';

export const UPDATE_STORY = gql`
  mutation UpdateStory($input: UpdateStoryInput!) {
    updateStory(input: $input) {
      story {
        id
      }
    }
  }
`;

interface EditStoryProps {
  analyticsPermissionType: TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];
}

const EditStoryScreen = ({ analyticsPermissionType }: EditStoryProps) => {
  const dispatch = useDispatch();
  useAnalytics(['story', 'edit'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType },
  });
  const { t } = useTranslation('editStoryScreen');
  const { container, backButton, textInput } = styles;
  const onRefresh: () => Promise<void> = useNavigationParam('onRefresh');
  const {
    objectDescription,
    celebrateableId,
  }: GetCelebrateFeed_community_celebrationItems_nodes = useNavigationParam(
    'celebrationItem',
  );
  const [updateStory] = useMutation<UpdateStory, UpdateStoryVariables>(
    UPDATE_STORY,
  );
  const [story, changeStory] = useState(objectDescription || undefined);

  const saveStory = async () => {
    if (!story) {
      return null;
    }
    Keyboard.dismiss();
    await updateStory({
      variables: { input: { id: celebrateableId, content: story } },
    });

    onRefresh();
    dispatch(navigateBack());
  };

  return (
    <View style={container}>
      <Header left={<BackButton iconStyle={backButton} />} />
      <ScrollView style={{ flex: 1 }} contentInset={{ bottom: 90 }}>
        <Input
          testID="EditInput"
          scrollEnabled={false}
          onChangeText={e => changeStory(e)}
          placeholder={t('inputPlaceholder')}
          value={story}
          autoFocus={true}
          autoCorrect={true}
          multiline={true}
          selectionColor={theme.secondaryColor}
          placeholderTextColor={theme.lightGrey}
          style={textInput}
        />
      </ScrollView>
      <BottomButton
        text={t('saveStory')}
        onPress={saveStory}
        testID="saveStoryButton"
      />
    </View>
  );
};

const mapStateToProps = (
  { auth }: { auth: AuthState },
  {
    navigation: {
      state: {
        params: { organization },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => ({
  analyticsPermissionType: getAnalyticsPermissionType(auth, organization),
});

export default connect(mapStateToProps)(EditStoryScreen);
export const CELEBRATE_EDIT_STORY_SCREEN = 'nav/CELEBRATE_EDIT_STORY_SCREEN';
