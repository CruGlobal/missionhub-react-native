import React, { useState } from 'react';
import { View, Keyboard } from 'react-native';
import { AnyAction } from 'redux';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';

import { Input } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
import { navigateBack } from '../../../actions/navigation';
import BackButton from '../../BackButton';
import theme from '../../../theme';
import { Event } from '../../../components/CelebrateItem';

import styles from './styles';

export const UPDATE_STORY = gql`
  mutation UpdateStory($input: StoryUpdateInput!) {
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
  const { t } = useTranslation('editStoryScreen');
  const { container, backButton, textInput } = styles;
  const onRefresh: () => Promise<void> = useNavigationParam('onRefresh');
  const { object_description, celebrateable_id }: Event = useNavigationParam(
    'celebrationItem',
  );
  const [updateStory] = useMutation(UPDATE_STORY);
  const [story, changeStory] = useState(object_description);

  const saveStory = async () => {
    if (!story) {
      return null;
    }
    Keyboard.dismiss();
    await updateStory({
      variables: { input: { id: celebrateable_id, content: story } },
    });

    onRefresh();
    dispatch(navigateBack());
  };

  return (
    <View style={container}>
      <Header left={<BackButton iconStyle={backButton} />} />
      <Input
        testID="EditInput"
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
      <BottomButton
        text={t('saveStory')}
        onPress={saveStory}
        testID="saveStoryButton"
      />
    </View>
  );
};

export default connect()(EditStoryScreen);
export const CELEBRATE_EDIT_STORY_SCREEN = 'nav/CELEBRATE_EDIT_STORY_SCREEN';
