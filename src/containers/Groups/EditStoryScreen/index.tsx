import React, { useState } from 'react';
import { View, Keyboard, ScrollView } from 'react-native';
import { AnyAction } from 'redux';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux-legacy';

import { Input } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
import { navigateBack } from '../../../actions/navigation';
import BackButton from '../../BackButton';
import theme from '../../../theme';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { AuthState } from '../../../reducers/auth';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../../CelebrateFeed/__generated__/GetCelebrateFeed';

import styles from './styles';
import { UpdateStory, UpdateStoryVariables } from './__generated__/UpdateStory';
import { getAnalyticsPermissionType } from 'src/utils/common';
import { orgPermissionSelector } from 'src/selectors/people';

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
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
}

const EditStoryScreen = ({ dispatch }: EditStoryProps) => {
  useAnalytics({ screenName: ['story', 'edit'] });
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
          returnKeyType="done"
          blurOnSubmit={true}
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
  analyticsPermissionType: getAnalyticsPermissionType(
    orgPermissionSelector({}, { person: auth.person, organization }),
  ),
});

export default connect(mapStateToProps)(EditStoryScreen);
export const CELEBRATE_EDIT_STORY_SCREEN = 'nav/CELEBRATE_EDIT_STORY_SCREEN';
